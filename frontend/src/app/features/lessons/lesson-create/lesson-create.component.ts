import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CourseService} from '../../../core/services/course.service';
import {LessonType} from '../../../core/models/course.model';

@Component({
  selector: 'app-lesson-create',
  templateUrl: './lesson-create.component.html',
  standalone: false,
  styleUrls: ['./lesson-create.component.scss']
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
      title: ['', Validators.required],
      content: [''],
      videoUrl: [''],
      type: [LessonType.Text, Validators.required],
      durationInMinutes: [30, [Validators.required, Validators.min(1), Validators.max(240)]],
      order: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['courseId'];
    this.moduleId = +this.route.snapshot.params['moduleId'];
  }

  onSubmit(): void {
    if (this.lessonForm.invalid) return;

    this.isLoading = true;
    const lessonData = {
      ...this.lessonForm.value,
      moduleId: this.moduleId
    };

    this.lessonService.createLesson(lessonData).subscribe({
      next: () => {
        this.snackBar.open('Lesson created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/courses', this.courseId]);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(`Error creating lesson: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses', this.courseId]);
  }
}
