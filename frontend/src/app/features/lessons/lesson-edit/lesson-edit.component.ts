import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CourseService} from '../../../core/services/course.service';
import {Lesson, LessonType} from '../../../core/models/course.model';

@Component({
  selector: 'app-lesson-edit',
  templateUrl: './lesson-edit.component.html',
  standalone: false,
  styleUrls: ['./lesson-edit.component.scss']
})
export class LessonEditComponent implements OnInit {
  lessonForm: FormGroup;
  loading = false
  courseId!: number;
  moduleId!: number;
  lessonId!: number;
  lesson: Lesson | null = null
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
    this.lessonId = +this.route.snapshot.params['lessonId'];
    this.loadLesson()
  }

  loadLesson(): void {
    this.loading = true
    this.lessonService.getLessonById(this.courseId, this.moduleId, this.lessonId).subscribe({
      next: (lesson) => {
        this.lesson = lesson
        this.lessonForm.patchValue({
          title: lesson.title,
          description: lesson.content,
          videoUrl: lesson.videoUrl,
          type: lesson.type,
          durationInMinutes: lesson.durationInMinutes,
          order: lesson.order,
        })
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    if (this.lessonForm.invalid) return;

    this.isLoading = true;
    const lessonData = {
      ...this.lessonForm.value,
      moduleId: this.moduleId
    };

    this.lessonService.updateLesson(this.courseId, this.moduleId, this.lessonId,lessonData).subscribe({
      next: () => {
        this.snackBar.open('Lesson updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/courses', this.courseId, "modules", this.moduleId, 'lessons']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(`Error updating lesson: ${err.message}`, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses', this.courseId, "modules", this.moduleId, 'lessons']);
  }
}
