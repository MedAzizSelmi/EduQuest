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
  UpdateLessonRequest,
} from "../models/course.model"
import { environment } from "../../../environments/environment"

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
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
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

  // Module endpoints
  getModules(courseId: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/${courseId}/modules`)
  }

  getModuleById(id: number): Observable<Module> {
    return this.http.get<Module>(`${environment.apiUrl}/api/modules/${id}`)
  }

  createModule(createModuleRequest: CreateModuleRequest): Observable<Module> {
    return this.http.post<Module>(`${environment.apiUrl}/api/modules`, createModuleRequest)
  }

  updateModule(id: number, updateModuleRequest: UpdateModuleRequest): Observable<Module> {
    return this.http.put<Module>(`${environment.apiUrl}/api/modules/${id}`, updateModuleRequest)
  }

  deleteModule(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/modules/${id}`)
  }

  // Lesson endpoints
  getLessons(moduleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${environment.apiUrl}/api/modules/${moduleId}/lessons`)
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${environment.apiUrl}/api/lessons/${id}`)
  }

  createLesson(createLessonRequest: CreateLessonRequest): Observable<Lesson> {
    return this.http.post<Lesson>(`${environment.apiUrl}/api/lessons`, createLessonRequest)
  }

  updateLesson(id: number, updateLessonRequest: UpdateLessonRequest): Observable<Lesson> {
    return this.http.put<Lesson>(`${environment.apiUrl}/api/lessons/${id}`, updateLessonRequest)
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/lessons/${id}`)
  }
}
