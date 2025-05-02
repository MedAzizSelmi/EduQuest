import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { QuizService } from "../../../core/services/quiz.service"
import { AuthService } from "../../../core/services/auth.service"
import { Quiz } from "../../../core/models/quiz.model"

@Component({
    selector: "app-quiz-list",
    templateUrl: "./quiz-list.component.html",
    styleUrls: ["./quiz-list.component.scss"],
    standalone: false
})
export class QuizListComponent implements OnInit {
  quizzes: Quiz[] = []
  loading = false
  courseId!: number
  isTeacherOrAdmin = false

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("courseId")!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadQuizzes()
  }

  loadQuizzes(): void {
    this.loading = true
    this.quizService.getQuizzesByCourse(this.courseId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading quizzes", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  viewQuiz(quiz: Quiz): void {
    this.router.navigate(["/quizzes", quiz.id])
  }

  createQuiz(): void {
    this.router.navigate(["/courses", this.courseId, "quizzes", "create"])
  }

  editQuiz(quiz: Quiz): void {
    this.router.navigate(["/quizzes", quiz.id, "edit"])
  }

  deleteQuiz(quiz: Quiz): void {
    if (confirm(`Are you sure you want to delete quiz "${quiz.title}"?`)) {
      this.quizService.deleteQuiz(quiz.id).subscribe({
        next: () => {
          this.snackBar.open("Quiz deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadQuizzes()
        },
        error: (error) => {
          this.snackBar.open(`Error deleting quiz: ${error}`, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }

  takeQuiz(quiz: Quiz): void {
    this.router.navigate(["/quizzes", quiz.id, "take"])
  }

  goBackToCourse(): void {
    this.router.navigate(["/courses", this.courseId])
  }
}
