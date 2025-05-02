export interface Question {
  id: number
  text: string
  type: "MultipleChoice" | "TrueFalse" | "ShortAnswer" | "Essay" | "Coding"
  points: number
  answers?: Answer[]
  correctAnswerIds?: number[]
  correctAnswerText?: string
}

export interface Answer {
  id: number
  text: string
  isCorrect?: boolean
}
