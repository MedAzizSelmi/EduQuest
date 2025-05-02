import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"

@Component({
    selector: "app-exam-create",
    templateUrl: "./exam-create.component.html",
    styleUrls: ["./exam-create.component.scss"],
    standalone: false
})
export class ExamCreateComponent implements OnInit {
  examForm!: FormGroup
  loading = false
  submitted = false
  courseId!: number
  minDate = new Date()

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("courseId")!
    this.initForm()
  }

  initForm(): void {
    // Set default start date to tomorrow
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1)
    startDate.setHours(9, 0, 0, 0)

    // Set default end date to 7 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)
    endDate.setHours(18, 0, 0, 0)

    this.examForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      startDate: [startDate, Validators.required],
      endDate: [endDate, Validators.required],
      timeLimit: [60, [Validators.required, Validators.min(10)]],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]],
      pointsToEarn: [100, [Validators.required, Validators.min(0)]],
      attemptsAllowed: [1, [Validators.required, Validators.min(1)]],
      isFinal: [false],
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
    const examData = {
      ...this.examForm.value,
      courseId: this.courseId,
    }

    this.examService.createExam(examData).subscribe({
      next: (exam) => {
        this.snackBar.open("Exam created successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/exams", exam.id, "edit"])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error creating exam: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/courses", this.courseId, "exams"])
  }
}
