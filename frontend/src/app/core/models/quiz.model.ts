import {Question} from './question.model';
import {SubmitAnswerRequest} from './submit-answer-request.model';

export interface Quiz {
  id: number
  title: string
  description: string
  courseId: number
  timeLimit: number
  passingScore: number
  pointsToEarn: number
  questionsCount?: number
  questions?: Question[]
}


export interface CreateQuizRequest {
  title: string
  description: string
  courseId: number
  timeLimit: number
  passingScore: number
  pointsToEarn: number
}

export interface UpdateQuizRequest {
  title?: string
  description?: string
  timeLimit?: number
  passingScore?: number
  pointsToEarn?: number
}

export interface SubmitQuizRequest {
  startTime: Date
  answers: SubmitAnswerRequest[]
}

export interface QuizResult {
  quizId: number
  quizTitle: string
  userId: string
  score: number
  isPassed: boolean
  pointsEarned: number
  startTime: Date
  endTime?: Date
  attemptsCount: number
}
