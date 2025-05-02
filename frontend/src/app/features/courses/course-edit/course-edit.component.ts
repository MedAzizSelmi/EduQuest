import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CourseService } from "../../../core/services/course.service"
import { Course } from "../../../core/models/course.model"

@Component({
  selector: "app-course-edit",
  templateUrl: "./course-edit.component.html",
  styleUrls: ["./course-edit.component.scss"],
  standalone: false
})
export class CourseEditComponent implements OnInit {
  courseForm!: FormGroup
  course: Course | null = null
  loading = false
  submitted = false
  courseId!: number

  categories = ["Programming", "Design", "Business", "Marketing", "Science", "Mathematics", "Language", "Other"]
  levels = ["Beginner", "Intermediate", "Advanced"]
  statuses = ["Draft", "Published", "Archived"]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get("id")!
    this.initForm()
    this.loadCourse()
  }

  initForm(): void {
    this.courseForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      thumbnailUrl: [""],
      status: ["Draft", Validators.required],
      durationInMinutes: [60, [Validators.required, Validators.min(10)]],
      pointsToEarn: [100, [Validators.required, Validators.min(0)]],
      category: ["Programming", Validators.required],
      level: ["Beginner", Validators.required],
    })
  }

  loadCourse(): void {
    this.loading = true
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          thumbnailUrl: course.thumbnailUrl,
          status: course.status,
          durationInMinutes: course.durationInMinutes,
          pointsToEarn: course.pointsToEarn,
          category: course.category,
          level: course.level,
        })
        this.loading = false
      },
      error: (error) => {
        this.snackBar.open("Error loading course", "Close", {
          duration: 5000,
        })
        this.loading = false
        this.router.navigate(["/courses"])
      },
    })
  }

  get f() {
    return this.courseForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    if (this.courseForm.invalid) {
      return
    }

    this.loading = true
    this.courseService.updateCourse(this.courseId, this.courseForm.value).subscribe({
      next: (course) => {
        this.snackBar.open("Course updated successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/courses", this.courseId])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error updating course: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/courses", this.courseId])
  }
}
