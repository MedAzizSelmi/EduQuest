// Base Dashboard interface
import { Certificate } from './certificate.model';
import { Exam } from './exam.model';

export interface Dashboard {
  [key: string]: any;
  userName: string;
  userRole: string;
  lastLogin: Date;
}

// Student Dashboard
export interface StudentDashboard extends Dashboard {
  enrolledCourses: EnrolledCourse[];
  upcomingDeadlines: Deadline[];
  recentActivities: Activity[];

  completedCourses: number;
  inProgressCourses: number;
  averageProgress: number;

  quizzesTaken: number;
  quizzesPassed: number;
  averageQuizScore: number;

  examsTaken: number;
  examsPassed: number;
  averageExamScore: number;

  certificatesEarned: Certificate[] | number;

  totalPointsEarned: number;
  earnedPoints: number;
  earnedBadges: number;
  currentLevel: number;
  nextLevelProgress: number;

  upcomingExams: Exam[];
}

// Teacher Dashboard interface (complete)
export interface TeacherDashboard extends Dashboard {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;

  totalStudents: number;
  totalEnrollments: number;
  completionRate: number;

  totalQuizzes: number;
  totalQuizAttempts: number;
  quizPassRate: number;

  totalExams: number;
  totalExamAttempts: number;
  examPassRate: number;

  courseStats: CourseStatistics[];

  recentEnrollments: EnrolledCourse[];
}



// Admin Dashboard
export interface AdminDashboard extends Dashboard {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;

  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;

  totalEnrollments: number;
  completedEnrollments: number;
  completionRate: number;

  totalCertificates: number;

  totalQuizzes: number;
  totalExams: number;

  systemUsage: SystemUsage;
  usersByRole: UsersByRole;

  userGrowth: GrowthStat[];
  courseGrowth: GrowthStat[];
  enrollmentGrowth: GrowthStat[];

  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;

  topCourses: TopCourse[];
}

// Supporting interfaces
export interface EnrolledCourse {
  id: number;
  title: string;
  progress: number;
  nextLesson: string;
  teacherName: string;
  dueDate?: Date;
}

export interface Deadline {
  id: number;
  title: string;
  courseTitle: string;
  dueDate: Date;
  type: 'quiz' | 'exam' | 'assignment';
}

export interface Activity {
  id: number;
  description: string;
  timestamp: Date;
  type: string;
  relatedItemId?: number;
  relatedItemTitle?: string;
}

export interface Submission {
  id: number;
  studentName: string;
  itemTitle: string;
  itemType: 'quiz' | 'exam' | 'assignment';
  submittedAt: Date;
  score?: number;
  status: 'pending' | 'graded' | 'reviewed';
}

export interface CourseStatistics {
  id: number;
  title: string;
  enrolledStudents: number;
  averageScore: number;
  completionRate: number;
}

export interface SystemUsage {
  dailyActiveUsers: number[];
  weeklyActiveUsers: number[];
  monthlyActiveUsers: number[];
  labels: string[];
}

export interface UsersByRole {
  students: number;
  teachers: number;
  admins: number;
}

export interface TopCourse {
  id: number;
  title: string;
  teacherName: string;
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
}

export interface GrowthStat {
  period: string;
  count: number;
}
