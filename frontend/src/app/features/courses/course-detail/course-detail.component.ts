import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Course, Module, Lesson } from "../../../core/models/course.model"
import { CourseService } from "../../../core/services/course.service"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.component.html",
  styleUrls: ["./course-detail.component.scss"],
  standalone: false
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null
  loading = false
  isTeacherOrAdmin = false
  isEnrolled = false
  isOwner = false
  activeModule: Module | null = null
  activeLesson: Lesson | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadCourse()
  }

  loadCourse(): void {
    this.loading = true
    const courseId = +this.route.snapshot.paramMap.get("id")!

    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course

        // Check if user is enrolled
        this.isEnrolled = course.progress !== undefined

        // Check if user is the course owner
        this.isOwner = this.authService.currentUserValue?.id === course.teacherId

        // Set active module and lesson if available
        if (course.modules && course.modules.length > 0) {
          this.activeModule = course.modules[0]

          if (this.activeModule.lessons && this.activeModule.lessons.length > 0) {
            this.activeLesson = this.activeModule.lessons[0]
          }
        }

        this.loading = false
      },
      error: () => {
        this.loading = false
        this.snackBar.open("Error loading course", "Close", {
          duration: 5000,
        })
      },
    })
  }

  enrollInCourse(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"], { queryParams: { returnUrl: `/courses/${this.course?.id}` } })
      return
    }

    if (!this.course) return

    this.courseService.enrollInCourse(this.course.id).subscribe({
      next: () => {
        this.snackBar.open("Successfully enrolled in course", "Close", {
          duration: 3000,
        })
        this.loadCourse() // Reload to get updated enrollment status
      },
      error: (error) => {
        this.snackBar.open(`Error enrolling in course: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  setActiveModule(module: Module): void {
    this.activeModule = module

    if (module.lessons && module.lessons.length > 0) {
      this.activeLesson = module.lessons[0]
    } else {
      this.activeLesson = null
    }
  }

  setActiveLesson(lesson: Lesson): void {
    this.activeLesson = lesson
  }

  editCourse(): void {
    if (!this.course) return
    this.router.navigate(["/courses", this.course.id, "edit"])
  }

  viewModules(courseId: number): void {
    if(!this.course) return
    this.router.navigate(['/courses', this.course.id, 'modules']);
  }

  viewQuizzes(): void {
    if (!this.course) return
    this.router.navigate(["/courses", this.course.id, "quizzes"])
  }

  viewExams(): void {
    if (!this.course) return
    this.router.navigate(["/courses", this.course.id, "exams"])
  }
}
