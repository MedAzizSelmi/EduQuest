import { Component, OnInit, OnDestroy } from "@angular/core"
import { FormBuilder, FormGroup, FormArray } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { QuizService } from "../../../core/services/quiz.service"
import { Quiz, Question, SubmitQuizRequest } from "../../../core/models/quiz.model"
import { Subscription, interval } from "rxjs"

@Component({
    selector: "app-quiz-take",
    templateUrl: "./quiz-take.component.html",
    styleUrls: ["./quiz-take.component.scss"],
    standalone: false
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  quiz: Quiz | null = null
  quizForm!: FormGroup
  loading = false
  submitting = false
  started = false
  completed = false
  quizResult: any = null

  // Timer variables
  startTime!: Date
  timeLeft = 0
  timerSubscription?: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const quizId = +this.route.snapshot.paramMap.get("id")!
    this.loadQuiz(quizId)
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

  loadQuiz(quizId: number): void {
    this.loading = true
    this.quizService.getQuizById(quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz
        this.initForm()
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading quiz", "Close", {
          duration: 5000,
        })
        this.loading = false
        this.router.navigate(["/courses"])
      },
    })
  }

  initForm(): void {
    this.quizForm = this.formBuilder.group({
      answers: this.formBuilder.array([]),
    })

    if (this.quiz?.questions) {
      const answersArray = this.quizForm.get("answers") as FormArray
      this.quiz.questions.forEach((question) => {
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
    return this.quizForm.get("answers") as FormArray
  }

  startQuiz(): void {
    this.started = true
    this.startTime = new Date()
    this.timeLeft = (this.quiz?.timeLimit || 30) * 60 // Convert minutes to seconds

    // Start the timer
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--
      if (this.timeLeft <= 0) {
        this.submitQuiz()
      }
    })
  }

  submitQuiz(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }

    this.submitting = true

    const submitData: SubmitQuizRequest = {
      startTime: this.startTime,
      answers: this.quizForm.value.answers,
    }

    this.quizService.submitQuiz(this.quiz!.id, submitData).subscribe({
      next: (result) => {
        this.quizResult = result
        this.completed = true
        this.submitting = false
      },
      error: (error) => {
        this.submitting = false
        this.snackBar.open(`Error submitting quiz: ${error}`, "Close", {
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
    if (this.quiz) {
      this.router.navigate(["/courses", this.quiz.courseId])
    } else {
      this.router.navigate(["/courses"])
    }
  }
}
