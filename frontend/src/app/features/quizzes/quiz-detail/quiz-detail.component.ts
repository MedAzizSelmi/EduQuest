import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { QuizService } from "../../../core/services/quiz.service"
import { AuthService } from "../../../core/services/auth.service"
import { Quiz } from "../../../core/models/quiz.model"

@Component({
    selector: "app-quiz-detail",
    templateUrl: "./quiz-detail.component.html",
    styleUrls: ["./quiz-detail.component.scss"],
    standalone: false
})
export class QuizDetailComponent implements OnInit {
  quiz: Quiz | null = null
  loading = false
  isTeacherOrAdmin = false

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const quizId = +this.route.snapshot.paramMap.get("id")!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadQuiz(quizId)
  }

  loadQuiz(quizId: number): void {
    this.loading = true
    this.quizService.getQuizById(quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz
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

  editQuiz(): void {
    if (!this.quiz) return
    this.router.navigate(["/quizzes", this.quiz.id, "edit"])
  }

  takeQuiz(): void {
    if (!this.quiz) return
    this.router.navigate(["/quizzes", this.quiz.id, "take"])
  }

  goBackToCourse(): void {
    if (!this.quiz) return
    this.router.navigate(["/courses", this.quiz.courseId, "quizzes"])
  }
}
