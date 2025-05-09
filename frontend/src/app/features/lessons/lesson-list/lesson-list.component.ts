import {Component, OnInit} from '@angular/core';
import {Lesson, Module} from '../../../core/models/course.model';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService} from '../../../core/services/course.service';
import {AuthService} from '../../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-lessons',
  templateUrl: './lesson-list.component.html',
  standalone: false,
  styleUrls: ['./lesson-list.component.scss']
})
export class LessonListComponent implements OnInit {
  courseId!: number
  moduleId!: number
  lessons: Lesson[] = []
  lesson: Lesson | null = null;
  isTeacherOrAdmin = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private lessonService: CourseService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.moduleId = +this.route.snapshot.paramMap.get('moduleId')!
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!
    this.isTeacherOrAdmin = this.authService.hasRole("Teacher") || this.authService.hasRole("Admin")
    this.loadLessons();
  }

  loadLessons() {
    this.lessonService.getLessons(this.courseId, this.moduleId).subscribe({
      next: (lessons) => this.lessons = lessons || [],
      error: (error) => {
        console.error('Error loading lessons:', error);
        this.lessons = []; // fallback
      }
    });
  }

  createLesson(): void {
    this.router.navigate(['/courses', this.courseId,'modules',this.moduleId, 'lessons', 'new'])
  }

  editLesson(lesson: Lesson): void {
    this.router.navigate(["/courses", this.courseId, "modules", this.moduleId, 'lessons', lesson.id, "edit"]);
  }

  deleteLesson(lesson: Lesson): void {
    if (confirm(`Are you sure you want to delete module "${lesson.title}"?`)) {
      this.lessonService.deleteLesson(this.courseId, this.moduleId, lesson.id).subscribe({
        next: () => {
          this.snackBar.open("Lesson deleted successfully", "Close", {
            duration: 3000,
          })
          this.loadLessons()
        },
        error: (error) => {
          this.snackBar.open(`Error deleting lesson: ${error}`, "Close", {
            duration: 5000,
          })
        },
      })
    }
  }

  readLesson(lesson: Lesson): void {
    this.router.navigate(["/courses", this.courseId, "modules", this.moduleId, 'lessons', lesson.id, "read"]);
  }

  goBackToCourse(): void {
    this.router.navigate(["/courses", this.courseId, "modules"])
  }
}
