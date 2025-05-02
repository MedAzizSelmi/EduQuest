import { Component, OnInit, OnDestroy } from "@angular/core"
import { FormBuilder, FormGroup, FormArray } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import { Exam, SubmitExamRequest } from "../../../core/models/exam.model"
import { Question } from "../../../core/models/question.model"
import { Subscription, interval } from "rxjs"

@Component({
  selector: "app-exam-take",
  templateUrl: "./exam-take.component.html",
  styleUrls: ["./exam-take.component.scss"],
  standalone: false
})
export class ExamTakeComponent implements OnInit, OnDestroy {
  exam: Exam | null = null
  examForm!: FormGroup
  loading = false
  submitting = false
  started = false
  completed = false
  examResult: any = null
  currentDate = new Date()

  // Timer variables
  startTime!: Date
  timeLeft = 0
  timerSubscription?: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const examId = +this.route.snapshot.paramMap.get("id")!
    this.loadExam(examId)
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  loadExam(examId: number): void {
    this.loading = true
    this.examService.getExamById(examId).subscribe({
      next: (exam) => {
        this.exam = exam
        this.initForm()
        this.loading = false

        // Check if exam is active
        if (!this.isExamActive()) {
          this.snackBar.open("This exam is not currently active", "Close", {
            duration: 5000,
          })
          this.router.navigate(["/exams", examId])
        }
      },
      error: (error) => {
        this.snackBar.open("Error loading exam", "Close", {
          duration: 5000,
        })
        this.loading = false
        this.router.navigate(["/courses"])
      },
    })
  }

  initForm(): void {
    this.examForm = this.formBuilder.group({
      answers: this.formBuilder.array([]),
    })

    if (this.exam?.questions) {
      const answersArray = this.examForm.get("answers") as FormArray
      this.exam.questions.forEach((question) => {
        answersArray.push(this.createQuestionForm(question))
      })
    }
  }

  createQuestionForm(question: Question): FormGroup {
    switch (question.type) {
      case "MultipleChoice":
        return this.formBuilder.group({
          questionId: [question.id],
          answerIds: [[]],
          textAnswer: [""],
          codeAnswer: [""],
        })
      case "TrueFalse":
        return this.formBuilder.group({
          questionId: [question.id],
          answerIds: [[]],
          textAnswer: [""],
          codeAnswer: [""],
        })
      case "ShortAnswer":
        return this.formBuilder.group({
          questionId: [question.id],
          answerIds: [[]],
          textAnswer: [""],
          codeAnswer: [""],
        })
      default:
        return this.formBuilder.group({
          questionId: [question.id],
          answerIds: [[]],
          textAnswer: [""],
          codeAnswer: [""],
        })
    }
  }

  get answers(): FormArray {
    return this.examForm.get("answers") as FormArray
  }

  startExam(): void {
    this.started = true
    this.startTime = new Date()
    this.timeLeft = (this.exam?.timeLimit || 60) * 60 // Convert minutes to seconds

    // Start the timer
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--
      if (this.timeLeft <= 0) {
        this.submitExam()
      }
    })
  }

  submitExam(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }

    this.submitting = true

    const submitData: SubmitExamRequest = {
      startTime: this.startTime,
      answers: this.examForm.value.answers,
    }

    this.examService.submitExam(this.exam!.id, submitData).subscribe({
      next: (result) => {
        this.examResult = result
        this.completed = true
        this.submitting = false
      },
      error: (error) => {
        this.submitting = false
        this.snackBar.open(`Error submitting exam: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  formatTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60)
    const seconds = this.timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  goBackToCourse(): void {
    if (this.exam) {
      this.router.navigate(["/courses", this.exam.courseId])
    } else {
      this.router.navigate(["/courses"])
    }
  }

  isExamActive(): boolean {
    if (!this.exam) return false
    const now = this.currentDate
    return now >= new Date(this.exam.startDate) && now <= new Date(this.exam.endDate)
  }
}
