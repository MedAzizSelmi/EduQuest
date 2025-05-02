import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { QuizService } from "../../../core/services/quiz.service"

@Component({
  selector: "app-quiz-create",
  templateUrl: "./quiz-create.component.html",
  styleUrls: ["./quiz-create.component.scss"],
  standalone: false
})
export class QuizCreateComponent implements OnInit {
  quizForm!: FormGroup
  loading = false
  submitted = false
  courseId!: number

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("courseId")!
    this.initForm()
  }

  initForm(): void {
    this.quizForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      timeLimit: [30, [Validators.required, Validators.min(1)]],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]],
      pointsToEarn: [100, [Validators.required, Validators.min(0)]],
    })
  }

  get f() {
    return this.quizForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.quizForm.invalid) {
      return
    }

    this.loading = true
    const quizData = {
      ...this.quizForm.value,
      courseId: this.courseId,
    }

    this.quizService.createQuiz(quizData).subscribe({
      next: (quiz) => {
        this.snackBar.open("Quiz created successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/quizzes", quiz.id, "edit"])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error creating quiz: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/courses", this.courseId, "quizzes"])
  }
}
