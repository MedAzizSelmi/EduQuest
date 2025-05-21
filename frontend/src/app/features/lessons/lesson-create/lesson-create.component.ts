import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { LessonType } from '../../../core/models/course.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lesson-create',
  templateUrl: './lesson-create.component.html',
  styleUrls: ['./lesson-create.component.scss'],
  standalone: false
})
export class LessonCreateComponent implements OnInit {
  lessonForm: FormGroup;
  courseId!: number;
  moduleId!: number;
  lessonTypes = Object.values(LessonType);
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lessonService: CourseService,
    private snackBar: MatSnackBar
  ) {
    this.lessonForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', Validators.required],
      videoUrl: ['', Validators.pattern('https?://.+')],
      type: [LessonType.Text, Validators.required],
      durationInMinutes: [30, [
        Validators.required,
        Validators.min(1),
        Validators.max(240)
      ]],
      order: [1, [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = +params['courseId'];
      this.moduleId = +params['moduleId'];

      if (isNaN(this.courseId) || isNaN(this.moduleId)) {
        this.router.navigate(['/']);
        return;
      }

      console.log(`Creating lesson for course ${this.courseId}, module ${this.moduleId}`);
    });
  }

  onSubmit(): void {
    if (this.lessonForm.invalid) return;

    this.isLoading = true;
    const lessonData = {
      ...this.lessonForm.value,
      moduleId: this.moduleId // Ensure this matches your DTO
    };

    this.lessonService.createLesson(this.courseId, this.moduleId, lessonData).subscribe({
      next: (lesson) => {
        // Lesson created successfully, even if navigation fails
        this.snackBar.open('Lesson created successfully', 'Close', { duration: 3000 });

        // Navigate to lesson list
        this.router.navigate(['/courses', this.courseId, 'modules', this.moduleId, 'lessons']);
      },
      error: (err) => {
        this.isLoading = false;
        // Lesson might still be created - check the database
        this.snackBar.open(
          'Lesson may have been created despite the error. Please refresh the list.',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses', this.courseId, 'modules', this.moduleId]);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get title() { return this.lessonForm.get('title'); }
  get content() { return this.lessonForm.get('content'); }
  get videoUrl() { return this.lessonForm.get('videoUrl'); }
  get type() { return this.lessonForm.get('type'); }
  get durationInMinutes() { return this.lessonForm.get('durationInMinutes'); }
  get order() { return this.lessonForm.get('order'); }
}
