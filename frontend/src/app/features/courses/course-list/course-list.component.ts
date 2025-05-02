import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Course } from "../../../core/models/course.model";
import { CourseService } from "../../../core/services/course.service";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-course-list",
  templateUrl: "./course-list.component.html",
  styleUrls: ["./course-list.component.scss"],
  standalone: false
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = false;
  searchTerm = "";
  categoryFilter = "All";
  levelFilter = "All";
  isTeacherOrAdmin = false;

  // Add categories array
  categories = ['Programming', 'Design', 'Business', 'Marketing',
    'Science', 'Mathematics', 'Language', 'Other'];

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin");
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;

    // If user is a teacher or admin, load their courses
    if (this.isTeacherOrAdmin) {
      this.courseService.getMyCourses().subscribe({
        next: (courses) => {
          this.courses = courses;
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      // Otherwise load all published courses
      this.courseService.getCourses().subscribe({
        next: (courses) => {
          this.courses = courses;
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  // Add resetFilters method
  resetFilters(): void {
    this.searchTerm = "";
    this.categoryFilter = "All";
    this.levelFilter = "All";
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.courses;

    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search) ||
          course.teacherName.toLowerCase().includes(search),
      );
    }

    // Apply category filter
    if (this.categoryFilter !== "All") {
      filtered = filtered.filter((course) => course.category === this.categoryFilter);
    }

    // Apply level filter
    if (this.levelFilter !== "All") {
      filtered = filtered.filter((course) => course.level === this.levelFilter);
    }

    this.filteredCourses = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryFilterChange(): void {
    this.applyFilters();
  }

  onLevelFilterChange(): void {
    this.applyFilters();
  }

  viewCourse(course: Course): void {
    this.router.navigate(["/courses", course.id]);
  }

  editCourse(course: Course): void {
    this.router.navigate(["/courses", course.id, "edit"]);
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.snackBar.open("Course deleted successfully", "Close", {
            duration: 3000,
          });
          this.loadCourses();
        },
        error: (error) => {
          this.snackBar.open(`Error deleting course: ${error}`, "Close", {
            duration: 5000,
          });
        },
      });
    }
  }

  enrollInCourse(course: Course): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"], { queryParams: { returnUrl: `/courses/${course.id}` } });
      return;
    }

    this.courseService.enrollInCourse(course.id).subscribe({
      next: () => {
        this.snackBar.open("Successfully enrolled in course", "Close", {
          duration: 3000,
        });
        this.router.navigate(["/courses", course.id]);
      },
      error: (error) => {
        this.snackBar.open(`Error enrolling in course: ${error}`, "Close", {
          duration: 5000,
        });
      },
    });
  }
}
