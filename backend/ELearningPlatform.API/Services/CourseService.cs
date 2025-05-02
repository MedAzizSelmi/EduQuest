using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class CourseService : ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseDto>> GetCoursesAsync(string userId = null)
        {
            var query = _context.Courses
                .Include(c => c.Teacher)
                .Include(c => c.Modules)
                .Include(c => c.UserCourses)
                .AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(c => c.UserCourses.Any(uc => uc.UserId == userId));
            }

            var courses = await query.ToListAsync();

            return courses.Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                ThumbnailUrl = c.ThumbnailUrl,
                TeacherId = c.TeacherId,
                TeacherName = $"{c.Teacher.FirstName} {c.Teacher.LastName}",
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Status = c.Status.ToString(),
                DurationInMinutes = c.DurationInMinutes,
                PointsToEarn = c.PointsToEarn,
                Category = c.Category,
                Level = c.Level,
                ModulesCount = c.Modules.Count,
                EnrolledStudentsCount = c.UserCourses.Count
            });
        }

        public async Task<CourseDto> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Teacher)
                .Include(c => c.Modules)
                    .ThenInclude(m => m.Lessons)
                .Include(c => c.Quizzes)
                .Include(c => c.Exams)
                .Include(c => c.UserCourses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null) return null;

            return new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                ThumbnailUrl = course.ThumbnailUrl,
                TeacherId = course.TeacherId,
                TeacherName = $"{course.Teacher.FirstName} {course.Teacher.LastName}",
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Status = course.Status.ToString(),
                DurationInMinutes = course.DurationInMinutes,
                PointsToEarn = course.PointsToEarn,
                Category = course.Category,
                Level = course.Level,
                ModulesCount = course.Modules.Count,
                EnrolledStudentsCount = course.UserCourses.Count,
                Modules = course.Modules.Select(m => new ModuleDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    Order = m.Order,
                    LessonsCount = m.Lessons.Count,
                    Lessons = m.Lessons.Select(l => new LessonDto
                    {
                        Id = l.Id,
                        Title = l.Title,
                        Type = l.Type.ToString(),
                        DurationInMinutes = l.DurationInMinutes,
                        Order = l.Order
                    }).ToList()
                }).ToList(),
                Quizzes = course.Quizzes.Select(q => new QuizDto
                {
                    Id = q.Id,
                    Title = q.Title,
                    Description = q.Description,
                    TimeLimit = q.TimeLimit,
                    PassingScore = q.PassingScore,
                    PointsToEarn = q.PointsToEarn
                }).ToList(),
                Exams = course.Exams.Select(e => new ExamDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    TimeLimit = e.TimeLimit,
                    PassingScore = e.PassingScore,
                    PointsToEarn = e.PointsToEarn,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsFinal = e.IsFinal
                }).ToList()
            };
        }

        public async Task<Course> CreateCourseAsync(CreateCourseDto courseDto, string teacherId)
        {
            var course = new Course
            {
                Title = courseDto.Title,
                Description = courseDto.Description,
                ThumbnailUrl = courseDto.ThumbnailUrl,
                TeacherId = teacherId,
                Status = CourseStatus.Draft,
                DurationInMinutes = courseDto.DurationInMinutes,
                PointsToEarn = courseDto.PointsToEarn,
                Category = courseDto.Category,
                Level = courseDto.Level
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course> UpdateCourseAsync(int id, UpdateCourseDto courseDto)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return null;

            course.Title = courseDto.Title ?? course.Title;
            course.Description = courseDto.Description ?? course.Description;
            course.ThumbnailUrl = courseDto.ThumbnailUrl ?? course.ThumbnailUrl;
            course.Status = courseDto.Status ?? course.Status;
            course.DurationInMinutes = courseDto.DurationInMinutes ?? course.DurationInMinutes;
            course.PointsToEarn = courseDto.PointsToEarn ?? course.PointsToEarn;
            course.Category = courseDto.Category ?? course.Category;
            course.Level = courseDto.Level ?? course.Level;
            course.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            _context.Courses.Remove(course);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EnrollUserInCourseAsync(string userId, int courseId)
        {
            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);

            if (userCourse != null) return false; // Already enrolled

            userCourse = new UserCourse
            {
                UserId = userId,
                CourseId = courseId,
                EnrollmentDate = DateTime.UtcNow,
                Progress = 0,
                IsCompleted = false,
                PointsEarned = 0
            };

            _context.UserCourses.Add(userCourse);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId)
        {
            var courses = await _context.Courses
                .Include(c => c.Teacher)
                .Include(c => c.Modules)
                .Include(c => c.UserCourses)
                .Where(c => c.TeacherId == teacherId)
                .ToListAsync();

            return courses.Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                ThumbnailUrl = c.ThumbnailUrl,
                TeacherId = c.TeacherId,
                TeacherName = $"{c.Teacher.FirstName} {c.Teacher.LastName}",
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Status = c.Status.ToString(),
                DurationInMinutes = c.DurationInMinutes,
                PointsToEarn = c.PointsToEarn,
                Category = c.Category,
                Level = c.Level,
                ModulesCount = c.Modules.Count,
                EnrolledStudentsCount = c.UserCourses.Count
            });
        }

        public async Task<IEnumerable<CourseDto>> GetStudentCoursesAsync(string studentId)
        {
            var userCourses = await _context.UserCourses
                .Include(uc => uc.Course)
                    .ThenInclude(c => c.Teacher)
                .Include(uc => uc.Course)
                    .ThenInclude(c => c.Modules)
                .Include(uc => uc.Course)
                    .ThenInclude(c => c.UserCourses)
                .Where(uc => uc.UserId == studentId)
                .ToListAsync();

            return userCourses.Select(uc => new CourseDto
            {
                Id = uc.Course.Id,
                Title = uc.Course.Title,
                Description = uc.Course.Description,
                ThumbnailUrl = uc.Course.ThumbnailUrl,
                TeacherId = uc.Course.TeacherId,
                TeacherName = $"{uc.Course.Teacher.FirstName} {uc.Course.Teacher.LastName}",
                CreatedAt = uc.Course.CreatedAt,
                UpdatedAt = uc.Course.UpdatedAt,
                Status = uc.Course.Status.ToString(),
                DurationInMinutes = uc.Course.DurationInMinutes,
                PointsToEarn = uc.Course.PointsToEarn,
                Category = uc.Course.Category,
                Level = uc.Course.Level,
                ModulesCount = uc.Course.Modules.Count,
                EnrolledStudentsCount = uc.Course.UserCourses.Count,
                Progress = uc.Progress,
                IsCompleted = uc.IsCompleted,
                PointsEarned = uc.PointsEarned,
                EnrollmentDate = uc.EnrollmentDate,
                CompletionDate = uc.CompletionDate
            });
        }
    }
}
