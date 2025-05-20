// progress.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CourseProgressState {
  completedLessons: Set<string>;
  totalLessons: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressMap: Map<string, CourseProgressState> = new Map();
  private courseProgressSubject = new BehaviorSubject<Map<string, number>>(new Map());
  public courseProgress$ = this.courseProgressSubject.asObservable();

  // Store total lessons for a course
  setTotalLessons(courseId: string, total: number): void {
    if (!this.progressMap.has(courseId)) {
      this.progressMap.set(courseId, {
        completedLessons: new Set<string>(),
        totalLessons: total
      });
    } else {
      this.progressMap.get(courseId)!.totalLessons = total;
    }
  }

  // Update progress only if lesson not completed yet
  updateLessonProgress(courseId: string, lessonId: string): void {
    const state = this.progressMap.get(courseId);

    if (!state || state.completedLessons.has(lessonId)) {
      return; // Already completed
    }

    state.completedLessons.add(lessonId);
    const completed = state.completedLessons.size;
    const total = state.totalLessons;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.courseProgressSubject.next(
      new Map(this.courseProgressSubject.value).set(courseId, progress)
    );
  }

  // Get current progress
  getCourseProgress(courseId: string): number {
    return this.courseProgressSubject.value.get(courseId) || 0;
  }
}
