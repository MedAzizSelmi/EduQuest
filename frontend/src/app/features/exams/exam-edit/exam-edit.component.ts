import { Component, type OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import { Exam } from "../../../core/models/exam.model"

@Component({
    selector: "app-exam-edit",
    templateUrl: "./exam-edit.component.html",
    styleUrls: ["./exam-edit.component.scss"],
    standalone: false
})
export class ExamEditComponent implements OnInit {
  examForm!: FormGroup
  exam: Exam | null = null
  loading = false
  submitted = false
  examId!: number
  minDate = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.examId = +this.route.snapshot.paramMap.get("id")!
    this.initForm()
    this.loadExam()
  }

  initForm(): void {
    this.examForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      timeLimit: [60, [Validators.required, Validators.min(10)]],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]],
      pointsToEarn: [100, [Validators.required, Validators.min(0)]],
      attemptsAllowed: [1, [Validators.required, Validators.min(1)]],
      isFinal: [false],
    })
  }

  loadExam(): void {
    this.loading = true
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam
        this.examForm.patchValue({
          title: exam.title,
          description: exam.description,
          startDate: new Date(exam.startDate),
          endDate: new Date(exam.endDate),
          timeLimit: exam.timeLimit,
          passingScore: exam.passingScore,
          pointsToEarn: exam.pointsToEarn,
          attemptsAllowed: exam.attemptsAllowed,
          isFinal: exam.isFinal,
        })
        this.loading = false
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

  get f() {
    return this.examForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.examForm.invalid) {
      return
    }

    // Validate that end date is after start date
    const startDate = this.examForm.value.startDate
    const endDate = this.examForm.value.endDate

    if (endDate <= startDate) {
      this.snackBar.open("End date must be after start date", "Close", {
        duration: 5000,
      })
      return
    }

    this.loading = true
    this.examService.updateExam(this.examId, this.examForm.value).subscribe({
      next: (exam) => {
        this.snackBar.open("Exam updated successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/exams", this.examId])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error updating exam: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/exams", this.examId])
  }

  manageQuestions(): void {
    // This would navigate to a question management page
    this.snackBar.open("Question management functionality would be implemented here", "Close", {
      duration: 3000,
    })
  }
}
