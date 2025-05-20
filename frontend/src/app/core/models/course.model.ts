export interface Course {
  id: number
  title: string
  description: string
  thumbnailUrl?: string
  teacherId: string
  teacherName: string
  createdAt: Date
  updatedAt: Date
  status: string
  durationInMinutes: number
  pointsToEarn: number
  category: string
  level: string
  modulesCount: number
  enrolledStudentsCount: number
  attachments?: Attachment[];
  modules?: Module[]
  quizzes?: Quiz[]
  exams?: Exam[]
  progress?: number
  isCompleted?: boolean
  pointsEarned?: number
  enrollmentDate?: Date
  completionDate?: Date
}

export interface Attachment {
  id: number
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadDate: Date
}

export interface Module {
  id: number
  title: string
  description: string
  order: number
  lessonsCount: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  title: string
  content?: string
  videoUrl?: string
  order: number
  durationInMinutes: number
  type: string
  isCompleted?: boolean
  completedAt?: Date
  lastAccessedAt?: Date
}

export interface LessonProgress {
  lessonId: number
  isCompleted: boolean
  completedAt: Date
  lastAccessedAt: Date
}

export interface CreateCourseRequest {
  title: string
  description: string
  thumbnailUrl?: string
  durationInMinutes: number
  pointsToEarn: number
  category: string
  level: string
  attachments?: File[]
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  thumbnailUrl?: string
  status?: string
  durationInMinutes?: number
  pointsToEarn?: number
  category?: string
  level?: string
}

export interface CreateModuleRequest {
  title: string
  description: string
  order: number
  courseId: number
}

export interface UpdateModuleRequest {
  title?: string
  description?: string
  order?: number
}

export interface CreateLessonRequest {
  title: string
  content?: string
  videoUrl?: string
  order: number
  durationInMinutes: number
  moduleId: number
  courseId: number
  type: LessonType
}

export interface UpdateLessonRequest {
  title?: string
  content?: string
  videoUrl?: string
  order?: number
  durationInMinutes?: number
  type?: LessonType
}

export enum LessonType {
  Video = 'Video',
  Text = 'Text',
  Interactive = 'Interactive',
  CodingExercise = 'CodingExercise'
}

export type Quiz = {}

export type Exam = {}
