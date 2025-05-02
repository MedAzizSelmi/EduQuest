import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { ExamService } from "../../../core/services/exam.service"
import { AuthService } from "../../../core/services/auth.service"
import { Exam } from "../../../core/models/exam.model"

@Component({
    selector: "app-exam-detail",
    templateUrl: "./exam-detail.component.html",
    styleUrls: ["./exam-detail.component.scss"],
    standalone: false
})
export class ExamDetailComponent implements OnInit {
  exam: Exam | null = null
  loading = false
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
    const examId = +this.route.snapshot.paramMap.get("id")!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadExam(examId)
  }

  loadExam(examId: number): void {
    this.loading = true
    this.examService.getExamById(examId).subscribe({
      next: (exam) => {
        this.exam = exam
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

  editExam(): void {
    if (!this.exam) return
    this.router.navigate(["/exams", this.exam.id, "edit"])
  }

  takeExam(): void {
    if (!this.exam) return
    this.router.navigate(["/exams", this.exam.id, "take"])
  }

  goBackToCourse(): void {
    if (!this.exam) return
    this.router.navigate(["/courses", this.exam.courseId, "exams"])
  }

  isExamActive(): boolean {
    if (!this.exam) return false
    const now = this.currentDate
    return now >= new Date(this.exam.startDate) && now <= new Date(this.exam.endDate)
  }

  isExamUpcoming(): boolean {
    if (!this.exam) return false
    return this.currentDate < new Date(this.exam.startDate)
  }

  isExamExpired(): boolean {
    if (!this.exam) return false
    return this.currentDate > new Date(this.exam.endDate)
  }

  getTimeUntilStart(): string {
    if (!this.exam) return ""
    const startDate = new Date(this.exam.startDate)
    const diff = startDate.getTime() - this.currentDate.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${days} days, ${hours} hours, ${minutes} minutes`
  }
}
