export interface Quiz {
  id: number
  title: string
  description: string
  courseId: number
  timeLimit: number
  passingScore: number
  pointsToEarn: number
  questionsCount: number
  questions?: Question[]
}

export interface Question {
  id: number
  text: string
  points: number
  type: string
  answers?: Answer[]
}

export interface Answer {
  id: number
  text: string
  isCorrect: boolean
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

export interface CreateQuestionRequest {
  text: string
  points: number
  type: string
  quizId: number
  answers: CreateAnswerRequest[]
}

export interface UpdateQuestionRequest {
  text?: string
  points?: number
  type?: string
}

export interface CreateAnswerRequest {
  text: string
  isCorrect: boolean
}

export interface UpdateAnswerRequest {
  text?: string
  isCorrect?: boolean
}

export interface SubmitQuizRequest {
  startTime: Date
  answers: SubmitAnswerRequest[]
}

export interface SubmitAnswerRequest {
  questionId: number
  answerIds?: number[]
  textAnswer?: string
  codeAnswer?: string
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
