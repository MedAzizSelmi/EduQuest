using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.DTOs
{
    public class DashboardDto
    {
        public int EnrolledCourses { get; set; }
        public int CompletedCourses { get; set; }
        public int InProgressCourses { get; set; }
        public double AverageProgress { get; set; }
        public int QuizzesTaken { get; set; }
        public int QuizzesPassed { get; set; }
        public double AverageQuizScore { get; set; }
        public int ExamsTaken { get; set; }
        public int ExamsPassed { get; set; }
        public double AverageExamScore { get; set; }
        public int CertificatesEarned { get; set; }
        public int TotalPointsEarned { get; set; }
        public int CurrentLevel { get; set; }
        public List<ActivityDto> RecentActivities { get; set; }
        public List<UpcomingExamDto> UpcomingExams { get; set; }
    }

    public class TeacherDashboardDto
    {
        public int TotalCourses { get; set; }
        public int PublishedCourses { get; set; }
        public int DraftCourses { get; set; }
        public int ArchivedCourses { get; set; }
        public int TotalStudents { get; set; }
        public int TotalEnrollments { get; set; }
        public double CompletionRate { get; set; }
        public int TotalQuizzes { get; set; }
        public int TotalQuizAttempts { get; set; }
        public double QuizPassRate { get; set; }
        public int TotalExams { get; set; }
        public int TotalExamAttempts { get; set; }
        public double ExamPassRate { get; set; }
        public List<CourseStatsDto> CourseStats { get; set; }
        public List<EnrollmentDto> RecentEnrollments { get; set; }
    }

    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalStudents { get; set; }
        public int TotalTeachers { get; set; }
        public int TotalAdmins { get; set; }
        public int TotalCourses { get; set; }
        public int PublishedCourses { get; set; }
        public int DraftCourses { get; set; }
        public int ArchivedCourses { get; set; }
        public int TotalEnrollments { get; set; }
        public int CompletedEnrollments { get; set; }
        public double CompletionRate { get; set; }
        public int TotalQuizzes { get; set; }
        public int TotalExams { get; set; }
        public int TotalCertificates { get; set; }
        public List<GrowthDto> UserGrowth { get; set; }
        public List<GrowthDto> CourseGrowth { get; set; }
        public List<GrowthDto> EnrollmentGrowth { get; set; }
        public List<TopCourseDto> TopCourses { get; set; }
    }

    public class ActivityDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; } // Course, Quiz, Exam, Certificate
        public DateTime Date { get; set; }
        public string Status { get; set; } // In Progress, Completed, Passed, Failed, Earned
        public int Progress { get; set; }
        public int Score { get; set; }
    }

    public class UpcomingExamDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CourseTitle { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TimeLimit { get; set; }
        public bool IsFinal { get; set; }
    }

    public class CourseStatsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Status { get; set; }
        public int EnrolledStudents { get; set; }
        public double CompletionRate { get; set; }
        public double AverageProgress { get; set; }
        public int QuizCount { get; set; }
        public int ExamCount { get; set; }
    }

    public class EnrollmentDto
    {
        public string UserId { get; set; }
        public int CourseId { get; set; }
        public string CourseTitle { get; set; }
        public DateTime EnrollmentDate { get; set; }
    }

    public class GrowthDto
    {
        public string Period { get; set; }
        public int Count { get; set; }
    }

    public class TopCourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string TeacherName { get; set; }
        public int EnrollmentCount { get; set; }
        public double CompletionRate { get; set; }
        public double AverageRating { get; set; }
    }
}
