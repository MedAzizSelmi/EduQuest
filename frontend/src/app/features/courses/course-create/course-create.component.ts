import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CourseService } from "../../../core/services/course.service"

@Component({
    selector: "app-course-create",
    templateUrl: "./course-create.component.html",
    styleUrls: ["./course-create.component.scss"],
    standalone: false
})
export class CourseCreateComponent implements OnInit {
  courseForm!: FormGroup
  loading = false
  submitted = false

  categories = ["Programming", "Design", "Business", "Marketing", "Science", "Mathematics", "Language", "Other"]

  levels = ["Beginner", "Intermediate", "Advanced"]

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ["", [Validators.required, Validators.minLength(20)]],
      thumbnailUrl: [""],
      durationInMinutes: [60, [Validators.required, Validators.min(10)]],
      pointsToEarn: [100, [Validators.required, Validators.min(0)]],
      category: ["Programming", Validators.required],
      level: ["Beginner", Validators.required],
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
    this.courseService.createCourse(this.courseForm.value).subscribe({
      next: (course) => {
        this.snackBar.open("Course created successfully", "Close", {
          duration: 3000,
        })
        this.router.navigate(["/courses", course.id, "edit"])
      },
      error: (error) => {
        this.loading = false
        this.snackBar.open(`Error creating course: ${error}`, "Close", {
          duration: 5000,
        })
      },
    })
  }

  onCancel(): void {
    this.router.navigate(["/courses"])
  }
}
