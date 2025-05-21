import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import {Observable, throwError} from "rxjs"
import {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  Module,
  CreateModuleRequest,
  UpdateModuleRequest,
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest, Attachment,
} from "../models/course.model"
import { environment } from "../../../environments/environment"
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/api/courses`

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl)
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/my-courses`)
  }

  getCourseById(id: number): Observable<Course> {
    if (isNaN(id)) {
      return throwError(() => new Error('Invalid course ID'));
    }
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  createCourse(createCourseRequest: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, createCourseRequest)
  }

  updateCourse(id: number, updateCourseRequest: UpdateCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, updateCourseRequest)
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  enrollInCourse(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/enroll`, {})
  }

  uploadAttachment(courseId: number, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Attachment>(`${this.apiUrl}/${courseId}/attachments`, formData);
  }

  getAttachments(courseId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/${courseId}/attachments`);
  }

  deleteAttachment(attachmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/attachments/${attachmentId}`);
  }

  // Module endpoints
  getModules(courseId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/${courseId}/modules`)
  }

  getModuleById(courseId: number, moduleId: number): Observable<Module> {
    return this.http.get<Module>(
      `${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}`
    );
  }

  createModule(createModuleRequest: CreateModuleRequest): Observable<Module> {
    return this.http.post<Module>(`${environment.apiUrl}/api/courses/${createModuleRequest.courseId}/modules`, createModuleRequest);
  }


  updateModule(courseId: number, moduleId: number, updateModuleRequest: UpdateModuleRequest): Observable<Module> {
    return this.http.put<Module>(`${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}`, updateModuleRequest)
  }

  deleteModule(courseId: number, moduleId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}`);
  }

  // Lesson endpoints
  getLessons(courseId: number, moduleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}/lessons`);
  }


  getLessonById(courseId: number, moduleId: number, lessonId: number): Observable<Lesson> {
    return this.http.get<Lesson>(
      `${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    );
  }

  createLesson(courseId: number, moduleId: number, createLessonRequest: CreateLessonRequest): Observable<Lesson> {
    return this.http.post<Lesson>(`${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}/lessons`, createLessonRequest).pipe(
      catchError  (error => {
        console.error('Error Creating lesson', error);
        return throwError(error);
      })
    )
  }

  updateLesson(
    courseId: number,
    moduleId: number,
    lessonId: number,
    updateLessonRequest: UpdateLessonRequest
  ): Observable<Lesson> {
    return this.http.put<Lesson>(
      `${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      updateLessonRequest
    );
  }

  deleteLesson(courseId: number, moduleId: number, lessonId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
  }
}
