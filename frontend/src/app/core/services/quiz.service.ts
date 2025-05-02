import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import {
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  Answer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  SubmitQuizRequest,
  QuizResult,
} from "../models/quiz.model"
import { environment } from "../../../environments/environment"

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
  getQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${environment.apiUrl}/api/questions/quiz/${quizId}`)
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${environment.apiUrl}/api/questions/${id}`)
  }

  createQuestion(createQuestionRequest: CreateQuestionRequest): Observable<Question> {
    return this.http.post<Question>(`${environment.apiUrl}/api/questions`, createQuestionRequest)
  }

  updateQuestion(id: number, updateQuestionRequest: UpdateQuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${environment.apiUrl}/api/questions/${id}`, updateQuestionRequest)
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/questions/${id}`)
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
