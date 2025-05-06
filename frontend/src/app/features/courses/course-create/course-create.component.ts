import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CourseService } from "../../../core/services/course.service"
import {firstValueFrom} from 'rxjs';

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
  selectedFiles: File[] = []

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
      attachments: [null],
    })
  }

  onFileChange(files: File[]): void {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  get f() {
    return this.courseForm.controls
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.courseForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      // First create the course - using await with proper type
      const course = await firstValueFrom(this.courseService.createCourse(this.courseForm.value));

      if (!course) {
        throw new Error('Course creation returned undefined');
      }

      // Then upload attachments if any files were selected
      if (this.selectedFiles.length > 0) {
        await Promise.all(
          this.selectedFiles.map(file =>
            firstValueFrom(this.courseService.uploadAttachment(course.id, file))
          )
        );
      }

      this.snackBar.open('Course created successfully', 'Close', {
        duration: 3000,
      });

      this.router.navigate(['/courses', course.id, 'edit']);
    } catch (error: unknown) {
      this.loading = false;

      // Type-safe error handling
      let errorMessage = 'Error creating course';
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      } else if (typeof error === 'object' && error !== null && 'error' in error) {
        const err = error as { error: { message?: string } };
        errorMessage += `: ${err.error.message || 'Unknown error'}`;
      }

      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    }
  }

  onCancel(): void {
    this.router.navigate(["/courses"])
  }
}
