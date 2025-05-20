import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Lesson } from '../../../core/models/course.model';
import {ProgressService} from '../../../core/services/progress.service';


@Component({
  selector: 'app-lesson-read',
  templateUrl: './lesson-read.component.html',
  styleUrls: ['./lesson-read.component.scss'],
  standalone: false,
})
export class LessonReadComponent implements OnInit {
  lesson: Lesson | null = null;
  isLoading = true;
  error: string | null = null;
  courseId: string | null = null;
  moduleId: string | null = null;
  lessonId: string | null = null;
  courseProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private progressService: ProgressService,
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.moduleId = this.route.snapshot.paramMap.get('moduleId');
    this.lessonId = this.route.snapshot.paramMap.get('lessonId');

    if (this.courseId && this.moduleId) {
      this.courseProgress = this.progressService.getCourseProgress(this.courseId);
    }

    if (this.courseId && this.moduleId && this.lessonId) {
      this.loadLesson();
    } else {
      this.error = 'Invalid route parameters';
      this.isLoading = false;
    }
  }

  private loadLesson(): void {
    this.http.get<Lesson>(`${environment.apiUrl}/api/courses/${this.courseId}/modules/${this.moduleId}/lessons/${this.lessonId}`)
      .subscribe({
        next: (lesson) => {
          this.lesson = lesson;
          this.isLoading = false;
          this.updateProgress();
        },
        error: (error) => {
          this.error = 'Failed to load lesson';
          this.isLoading = false;
          this.snackBar.open('Error loading lesson', 'Close', { duration: 3000 });
        }
      });
  }

  // lesson-read.component.ts

  updateProgress(): void {
    if (this.courseId && this.lessonId) {
      this.progressService.updateLessonProgress(this.courseId, this.lessonId);
      this.snackBar.open('Lesson completed', 'Close', { duration: 2000 });
    }
  }

  onNavigateBack(): void {
    this.router.navigate(['/courses', this.courseId, 'modules', this.moduleId, 'lessons']);
  }
}
