import { Injectable } from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import type { Observable } from "rxjs"
import {
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  SubmitQuizRequest,
  QuizResult,
} from "../models/quiz.model"
import { environment } from "../../../environments/environment"
import {
  Answer,
  CreateAnswerRequest,
  CreateQuestionRequest,
  Question, UpdateAnswerRequest,
  UpdateQuestionRequest
} from '../models/question.model';

@Injectable({
  providedIn: "root",
})
export class QuizService {
  private apiUrl = `${environment.apiUrl}/api/quizzes`

  constructor(private http: HttpClient) {}

  getQuizzesByCourse(courseId: number): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/course/${courseId}`)
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`)
  }

  createQuiz(createQuizRequest: CreateQuizRequest): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, createQuizRequest)
  }

  updateQuiz(id: number, updateQuizRequest: UpdateQuizRequest): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, updateQuizRequest)
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  submitQuiz(id: number, submitQuizRequest: SubmitQuizRequest): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/${id}/submit`, submitQuizRequest)
  }

  getUserQuizResults(): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/results`)
  }

  getQuizResultsByCourse(courseId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/course/${courseId}/results`)
  }

  // Question endpoints
  getQuestionsByQuiz(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/${quizId}/questions`);
  }

  getQuestion(quizId: number, questionId: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${quizId}/questions/${questionId}`);
  }

  getQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/api/questions/quiz/${quizId}`)
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${environment.apiUrl}/api/questions/${id}`)
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

  updateQuestion(quizId: number, questionId: number, updateQuestionRequest: UpdateQuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${quizId}/questions/${questionId}`, updateQuestionRequest)
  }

  deleteQuestion(quizId: number, id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${quizId}/questions/${id}`)
  }

  // Answer endpoints
  getAnswers(questionId: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${environment.apiUrl}/api/questions/${questionId}/answers`)
  }

  createAnswer(questionId: number, createAnswerRequest: CreateAnswerRequest): Observable<Answer> {
    return this.http.post<Answer>(`${environment.apiUrl}/api/questions/${questionId}/answers`, createAnswerRequest)
  }

  updateAnswer(id: number, updateAnswerRequest: UpdateAnswerRequest): Observable<Answer> {
    return this.http.put<Answer>(`${environment.apiUrl}/api/answers/${id}`, updateAnswerRequest)
  }

  deleteAnswer(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/answers/${id}`)
  }
}
