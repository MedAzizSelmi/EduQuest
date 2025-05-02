import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { QuizService } from "../../../core/services/quiz.service"
import { Quiz } from "../../../core/models/quiz.model"

@Component({
    selector: "app-quiz-edit",
    templateUrl: "./quiz-edit.component.html",
    styleUrls: ["./quiz-edit.component.scss"],
    standalone: false
})
export class QuizEditComponent implements OnInit {
  quizForm!: FormGroup
  quiz: Quiz | null = null
  loading = false
  submitted = false
  quizId!: number

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get("id")!
    this.initForm()
    this.loadQuiz()
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

  loadQuiz(): void {
    this.loading = true
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz
        this.quizForm.patchValue({
          title: quiz.title,
          description: quiz.description,
          timeLimit: quiz.timeLimit,
          passingScore: quiz.passingScore,
          pointsToEarn: quiz.pointsToEarn,
        })
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

  get f() {
    return this.quizForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.quizForm.invalid) {
      return
    }

    this.loading = true
    this.quizService.updateQuiz(this.quizId, this.quizForm.value).subscribe({
      next: (quiz) => {
        this.snackBar.open("Quiz updated successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/quizzes", this.quizId])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error updating quiz: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/quizzes", this.quizId])
  }

  manageQuestions(): void {
    // This would navigate to a question management page
    this.snackBar.open("Question management functionality would be implemented here", "Close", {
      duration: 3000,
    })
  }
}
