export interface Badge {
  id: number
  name: string
  description: string
  imageUrl: string
  category: string
  points: number
  criteria: string
  isEarned: boolean
  earnedDate?: Date
}

export interface BadgeCategory {
  name: string
  description: string
  badges: Badge[]
}
