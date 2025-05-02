export interface SubmitAnswerRequest {
  questionId: number
  answerIds?: number[]
  textAnswer?: string
  codeAnswer?: string
}
