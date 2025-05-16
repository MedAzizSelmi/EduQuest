import { Injectable } from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import type { Observable } from "rxjs"
import { Exam, CreateExamRequest, UpdateExamRequest, SubmitExamRequest, ExamResult } from "../models/exam.model"
import { environment } from "../../../environments/environment"
import {CreateQuestionRequest, Question, UpdateQuestionRequest} from '../models/question.model';

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

  getQuestionsByExam(examId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${examId}/questions`);
  }

  createQuestion(createQuestionRequest: CreateQuestionRequest): Observable<Question> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
    return this.http.post<Question>(`${this.apiUrl}/questions/create`, createQuestionRequest, {headers})
  }

  private getAuthToken(): string {
    // Implement your actual token retrieval logic
    return localStorage.getItem('auth_token') || '';
  }

  updateQuestion(examId: number, questionId: number, updateQuestionRequest: UpdateQuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${examId}/questions/${questionId}`, updateQuestionRequest)
  }

  deleteQuestion(examId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${examId}/questions/${id}`)
  }

  getUserExamResults(): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/results`)
  }

  getExamResultsByCourse(courseId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/course/${courseId}/results`)
  }
}
