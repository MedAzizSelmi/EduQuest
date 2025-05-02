import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import { AuthService } from "../../../core/services/auth.service"
import { Exam } from "../../../core/models/exam.model"

@Component({
    selector: "app-exam-list",
    templateUrl: "./exam-list.component.html",
    styleUrls: ["./exam-list.component.scss"],
    standalone: false
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = []
  loading = false
  courseId!: number
  isTeacherOrAdmin = false
  currentDate = new Date()

  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("courseId")!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadExams()
  }

  loadExams(): void {
    this.loading = true
    this.examService.getExamsByCourse(this.courseId).subscribe({
      next: (exams) => {
        this.exams = exams
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading exams", "Close", {
          duration: 5000,
        })
        this.loading = false
      },
    })
  }

  viewExam(exam: Exam): void {
    this.router.navigate(["/exams", exam.id])
  }

  createExam(): void {
    this.router.navigate(["/courses", this.courseId, "exams", "create"])
  }

  editExam(exam: Exam): void {
    this.router.navigate(["/exams", exam.id, "edit"])
  }

  deleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete exam "${exam.title}"?`)) {
      this.examService.deleteExam(exam.id).subscribe({
        next: () => {
          this.snackBar.open("Exam deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadExams()
        },
        error: (error) => {
          this.snackBar.open(`Error deleting exam: ${error}`, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }

  takeExam(exam: Exam): void {
    this.router.navigate(["/exams", exam.id, "take"])
  }

  goBackToCourse(): void {
    this.router.navigate(["/courses", this.courseId])
  }

  isExamActive(exam: Exam): boolean {
    const now = this.currentDate
    return now >= new Date(exam.startDate) && now <= new Date(exam.endDate)
  }

  isExamUpcoming(exam: Exam): boolean {
    return this.currentDate < new Date(exam.startDate)
  }

  isExamExpired(exam: Exam): boolean {
    return this.currentDate > new Date(exam.endDate)
  }
}
