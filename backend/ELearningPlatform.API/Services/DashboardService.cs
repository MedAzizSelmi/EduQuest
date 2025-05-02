using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetStudentDashboardAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.UserCourses)
                    .ThenInclude(uc => uc.Course)
                .Include(u => u.UserQuizzes)
                    .ThenInclude(uq => uq.Quiz)
                .Include(u => u.UserExams)
                    .ThenInclude(ue => ue.Exam)
                .Include(u => u.Certificates)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            var enrolledCourses = user.UserCourses.Count;
            var completedCourses = user.UserCourses.Count(uc => uc.IsCompleted);
            var inProgressCourses = enrolledCourses - completedCourses;
            var averageProgress = user.UserCourses.Any() ? user.UserCourses.Average(uc => uc.Progress) : 0;

            var quizzesTaken = user.UserQuizzes.Count;
            var quizzesPassed = user.UserQuizzes.Count(uq => uq.IsPassed);
            var averageQuizScore = user.UserQuizzes.Any() ? user.UserQuizzes.Average(uq => uq.Score) : 0;

            var examsTaken = user.UserExams.Count;
            var examsPassed = user.UserExams.Count(ue => ue.IsPassed);
            var averageExamScore = user.UserExams.Any() ? user.UserExams.Average(ue => ue.Score) : 0;

            var certificatesEarned = user.Certificates.Count;
            var totalPointsEarned = user.Points;
            var currentLevel = user.Level;

            // Recent activities
            var recentCourseActivities = user.UserCourses
                .OrderByDescending(uc => uc.EnrollmentDate)
                .Take(5)
                .Select(uc => new ActivityDto
                {
                    Id = uc.CourseId,
                    Title = uc.Course.Title,
                    Type = "Course",
                    Date = uc.EnrollmentDate,
                    Status = uc.IsCompleted ? "Completed" : "In Progress",
                    Progress = uc.Progress
                });

            var recentQuizActivities = user.UserQuizzes
                .OrderByDescending(uq => uq.EndTime)
                .Take(5)
                .Select(uq => new ActivityDto
                {
                    Id = uq.QuizId,
                    Title = uq.Quiz.Title,
                    Type = "Quiz",
                    Date = uq.EndTime ?? DateTime.MinValue,
                    Status = uq.IsPassed ? "Passed" : "Failed",
                    Score = uq.Score
                });

            var recentExamActivities = user.UserExams
                .OrderByDescending(ue => ue.EndTime)
                .Take(5)
                .Select(ue => new ActivityDto
                {
                    Id = ue.ExamId,
                    Title = ue.Exam.Title,
                    Type = "Exam",
                    Date = ue.EndTime ?? DateTime.MinValue,
                    Status = ue.IsPassed ? "Passed" : "Failed",
                    Score = ue.Score
                });

            var recentCertificates = user.Certificates
                .OrderByDescending(c => c.IssuedDate)
                .Take(5)
                .Select(c => new ActivityDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Type = "Certificate",
                    Date = c.IssuedDate,
                    Status = "Earned"
                });

            var recentActivities = recentCourseActivities
                .Concat(recentQuizActivities)
                .Concat(recentExamActivities)
                .Concat(recentCertificates)
                .OrderByDescending(a => a.Date)
                .Take(10)
                .ToList();

            // Upcoming exams
            var now = DateTime.UtcNow;
            var upcomingExams = await _context.Exams
                .Include(e => e.Course)
                .Where(e => e.StartDate > now && e.Course.UserCourses.Any(uc => uc.UserId == userId))
                .OrderBy(e => e.StartDate)
                .Take(5)
                .Select(e => new UpcomingExamDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    CourseTitle = e.Course.Title,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    TimeLimit = e.TimeLimit,
                    IsFinal = e.IsFinal
                })
                .ToListAsync();

            return new DashboardDto
            {
                EnrolledCourses = enrolledCourses,
                CompletedCourses = completedCourses,
                InProgressCourses = inProgressCourses,
                AverageProgress = averageProgress,
                QuizzesTaken = quizzesTaken,
                QuizzesPassed = quizzesPassed,
                AverageQuizScore = averageQuizScore,
                ExamsTaken = examsTaken,
                ExamsPassed = examsPassed,
                AverageExamScore = averageExamScore,
                CertificatesEarned = certificatesEarned,
                TotalPointsEarned = totalPointsEarned,
                CurrentLevel = currentLevel,
                RecentActivities = recentActivities,
                UpcomingExams = upcomingExams
            };
        }

        public async Task<TeacherDashboardDto> GetTeacherDashboardAsync(string teacherId)
        {
            var courses = await _context.Courses
                .Include(c => c.UserCourses)
                .Include(c => c.Quizzes)
                    .ThenInclude(q => q.UserQuizzes)
                .Include(c => c.Exams)
                    .ThenInclude(e => e.UserExams)
                .Where(c => c.TeacherId == teacherId)
                .ToListAsync();

            if (courses == null || !courses.Any()) return null;

            var totalCourses = courses.Count;
            var publishedCourses = courses.Count(c => c.Status == CourseStatus.Published);
            var draftCourses = courses.Count(c => c.Status == CourseStatus.Draft);
            var archivedCourses = courses.Count(c => c.Status == CourseStatus.Archived);

            var totalStudents = courses.SelectMany(c => c.UserCourses).Select(uc => uc.UserId).Distinct().Count();
            var totalEnrollments = courses.Sum(c => c.UserCourses.Count);
            var completionRate = totalEnrollments > 0 
                ? (double)courses.Sum(c => c.UserCourses.Count(uc => uc.IsCompleted)) / totalEnrollments * 100 
                : 0;

            var totalQuizzes = courses.Sum(c => c.Quizzes.Count);
            var totalQuizAttempts = courses.Sum(c => c.Quizzes.Sum(q => q.UserQuizzes.Count));
            var quizPassRate = totalQuizAttempts > 0 
                ? (double)courses.Sum(c => c.Quizzes.Sum(q => q.UserQuizzes.Count(uq => uq.IsPassed))) / totalQuizAttempts * 100 
                : 0;

            var totalExams = courses.Sum(c => c.Exams.Count);
            var totalExamAttempts = courses.Sum(c => c.Exams.Sum(e => e.UserExams.Count));
            var examPassRate = totalExamAttempts > 0 
                ? (double)courses.Sum(c => c.Exams.Sum(e => e.UserExams.Count(ue => ue.IsPassed))) / totalExamAttempts * 100 
                : 0;

            // Course statistics
            var courseStats = courses.Select(c => new CourseStatsDto
            {
                Id = c.Id,
                Title = c.Title,
                Status = c.Status.ToString(),
                EnrolledStudents = c.UserCourses.Count,
                CompletionRate = c.UserCourses.Any() 
                    ? (double)c.UserCourses.Count(uc => uc.IsCompleted) / c.UserCourses.Count * 100 
                    : 0,
                AverageProgress = c.UserCourses.Any() 
                    ? c.UserCourses.Average(uc => uc.Progress) 
                    : 0,
                QuizCount = c.Quizzes.Count,
                ExamCount = c.Exams.Count
            }).ToList();

            // Recent enrollments
            var recentEnrollments = courses
                .SelectMany(c => c.UserCourses)
                .OrderByDescending(uc => uc.EnrollmentDate)
                .Take(10)
                .Select(uc => new EnrollmentDto
                {
                    UserId = uc.UserId,
                    CourseId = uc.CourseId,
                    CourseTitle = uc.Course.Title,
                    EnrollmentDate = uc.EnrollmentDate
                })
                .ToList();

            return new TeacherDashboardDto
            {
                TotalCourses = totalCourses,
                PublishedCourses = publishedCourses,
                DraftCourses = draftCourses,
                ArchivedCourses = archivedCourses,
                TotalStudents = totalStudents,
                TotalEnrollments = totalEnrollments,
                CompletionRate = completionRate,
                TotalQuizzes = totalQuizzes,
                TotalQuizAttempts = totalQuizAttempts,
                QuizPassRate = quizPassRate,
                TotalExams = totalExams,
                TotalExamAttempts = totalExamAttempts,
                ExamPassRate = examPassRate,
                CourseStats = courseStats,
                RecentEnrollments = recentEnrollments
            };
        }

        public async Task<AdminDashboardDto> GetAdminDashboardAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalStudents = await _context.Users.CountAsync(u => u.Role == UserRole.Student);
            var totalTeachers = await _context.Users.CountAsync(u => u.Role == UserRole.Teacher);
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == UserRole.Admin);

            var totalCourses = await _context.Courses.CountAsync();
            var publishedCourses = await _context.Courses.CountAsync(c => c.Status == CourseStatus.Published);
            var draftCourses = await _context.Courses.CountAsync(c => c.Status == CourseStatus.Draft);
            var archivedCourses = await _context.Courses.CountAsync(c => c.Status == CourseStatus.Archived);

            var totalEnrollments = await _context.UserCourses.CountAsync();
            var completedEnrollments = await _context.UserCourses.CountAsync(uc => uc.IsCompleted);
            var completionRate = totalEnrollments > 0 ? (double)completedEnrollments / totalEnrollments * 100 : 0;

            var totalQuizzes = await _context.Quizzes.CountAsync();
            var totalExams = await _context.Exams.CountAsync();
            var totalCertificates = await _context.Certificates.CountAsync();

            // User growth over time (last 6 months)
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            var userGrowth = await _context.Users
                .Where(u => u.CreatedAt >= sixMonthsAgo)
                .GroupBy(u => new { Month = u.CreatedAt.Month, Year = u.CreatedAt.Year })
                .Select(g => new GrowthDto
                {
                    Period = $"{g.Key.Year}-{g.Key.Month}",
                    Count = g.Count()
                })
                .OrderBy(g => g.Period)
                .ToListAsync();

            // Course growth over time (last 6 months)
            var courseGrowth = await _context.Courses
                .Where(c => c.CreatedAt >= sixMonthsAgo)
                .GroupBy(c => new { Month = c.CreatedAt.Month, Year = c.CreatedAt.Year })
                .Select(g => new GrowthDto
                {
                    Period = $"{g.Key.Year}-{g.Key.Month}",
                    Count = g.Count()
                })
                .OrderBy(g => g.Period)
                .ToListAsync();

            // Enrollment growth over time (last 6 months)
            var enrollmentGrowth = await _context.UserCourses
                .Where(uc => uc.EnrollmentDate >= sixMonthsAgo)
                .GroupBy(uc => new { Month = uc.EnrollmentDate.Month, Year = uc.EnrollmentDate.Year })
                .Select(g => new GrowthDto
                {
                    Period = $"{g.Key.Year}-{g.Key.Month}",
                    Count = g.Count()
                })
                .OrderBy(g => g.Period)
                .ToListAsync();

            // Top courses by enrollment
            var topCourses = await _context.Courses
                .Include(c => c.Teacher)
                .Include(c => c.UserCourses)
                .OrderByDescending(c => c.UserCourses.Count)
                .Take(10)
                .Select(c => new TopCourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    TeacherName = $"{c.Teacher.FirstName} {c.Teacher.LastName}",
                    EnrollmentCount = c.UserCourses.Count,
                    CompletionRate = c.UserCourses.Any() 
                        ? (double)c.UserCourses.Count(uc => uc.IsCompleted) / c.UserCourses.Count * 100 
                        : 0,
                    AverageRating = 0 // Placeholder for future rating system
                })
                .ToListAsync();

            return new AdminDashboardDto
            {
                TotalUsers = totalUsers,
                TotalStudents = totalStudents,
                TotalTeachers = totalTeachers,
                TotalAdmins = totalAdmins,
                TotalCourses = totalCourses,
                PublishedCourses = publishedCourses,
                DraftCourses = draftCourses,
                ArchivedCourses = archivedCourses,
                TotalEnrollments = totalEnrollments,
                CompletedEnrollments = completedEnrollments,
                CompletionRate = completionRate,
                TotalQuizzes = totalQuizzes,
                TotalExams = totalExams,
                TotalCertificates = totalCertificates,
                UserGrowth = userGrowth,
                CourseGrowth = courseGrowth,
                EnrollmentGrowth = enrollmentGrowth,
                TopCourses = topCourses
            };
        }
    }
}
