export interface Question {
  id: number
  quizId: number
  text: string
  points: number
  type: QuestionType
  answers?: Answer[]
}

export enum QuestionType {
  MultipleChoice = 'MultipleChoice',
  TrueFalse = 'TrueFalse',
  ShortAnswer = 'ShortAnswer',
  Essay = 'Essay',
  Coding = 'Coding'
}

export interface Answer {
  id?: number
  text: string
  isCorrect: boolean
  questionId?: number
}

export interface CreateQuestionRequest {
  text: string
  points: number
  type: QuestionType
  quizId: number
  answers: CreateAnswerRequest[]
}

export interface UpdateQuestionRequest {
  text?: string
  points?: number
  type?: QuestionType
}

export interface CreateAnswerRequest {
  text: string
  isCorrect: boolean
}

export interface UpdateAnswerRequest {
  text?: string
  isCorrect?: boolean
}
