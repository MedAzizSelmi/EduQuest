export interface Certificate {
  id: number
  title: string
  description: string
  courseId: number
  courseTitle: string
  userId: string
  issuedDate: Date
  certificateUrl: string
  verificationCode: string
}
