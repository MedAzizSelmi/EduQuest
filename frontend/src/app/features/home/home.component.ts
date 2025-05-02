import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { AuthService } from "../../core/services/auth.service"
import { CourseService } from "../../core/services/course.service"
import { Course } from "../../core/models/course.model"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: false
})
export class HomeComponent implements OnInit {
  isAuthenticated = false
  featuredCourses: Course[] = []
  loading = false

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated()
    this.loadFeaturedCourses()
  }

  loadFeaturedCourses(): void {
    this.loading = true
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        // Get up to 6 published courses
        this.featuredCourses = courses.filter((course) => course.status === "Published").slice(0, 6)
        this.loading = false
      },
      error: () => {
        this.loading = false
      },
    })
  }

  navigateToDashboard(): void {
    if (this.authService.hasRole("Student")) {
      this.router.navigate(["/student"])
    } else if (this.authService.hasRole("Teacher")) {
      this.router.navigate(["/teacher"])
    } else if (this.authService.hasRole("Admin")) {
      this.router.navigate(["/admin"])
    } else {
      this.router.navigate(["/dashboard"])
    }
  }
}
