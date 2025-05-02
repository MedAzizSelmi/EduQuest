import type { Question } from "./question.model"
import type { SubmitAnswerRequest } from "./submit-answer-request.model"

export interface Exam {
  attemptsAllowed: number;
  id: number
  title: string
  description: string
  courseId: number
  timeLimit: number
  passingScore: number
  pointsToEarn: number
  startDate: Date
  endDate: Date
  isFinal: boolean
  questionsCount: number
  questions?: Question[]
}

export interface CreateExamRequest {
  title: string
  description: string
  courseId: number
  timeLimit: number
  passingScore: number
  pointsToEarn: number
  startDate: Date
  endDate: Date
  isFinal: boolean
}

export interface UpdateExamRequest {
  title?: string
  description?: string
  timeLimit?: number
  passingScore?: number
  pointsToEarn?: number
  startDate?: Date
  endDate?: Date
  isFinal?: boolean
}

export interface SubmitExamRequest {
  startTime: Date
  answers: SubmitAnswerRequest[]
}

export interface ExamResult {
  examId: number
  examTitle: string
  userId: string
  score: number
  isPassed: boolean
  pointsEarned: number
  startTime: Date
  endTime?: Date
  message?: string
}
