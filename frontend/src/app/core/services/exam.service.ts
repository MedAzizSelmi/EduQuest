import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import { Exam, CreateExamRequest, UpdateExamRequest, SubmitExamRequest, ExamResult } from "../models/exam.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/api/exams`

  constructor(private http: HttpClient) {}

  getExamsByCourse(courseId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/course/${courseId}`)
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`)
  }

  createExam(createExamRequest: CreateExamRequest): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, createExamRequest)
  }

  updateExam(id: number, updateExamRequest: UpdateExamRequest): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, updateExamRequest)
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  submitExam(id: number, submitExamRequest: SubmitExamRequest): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/${id}/submit`, submitExamRequest)
  }

  getUserExamResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results`)
  }

  getExamResultsByCourse(courseId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/course/${courseId}/results`)
  }
}
