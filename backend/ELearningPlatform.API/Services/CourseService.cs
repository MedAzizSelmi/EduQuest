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
            }).ToList();
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
                        Type = l.Type,
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
        
        public async Task<AttachmentDto> UploadAttachmentAsync(int courseId, string userId, IFormFile file)
        {
            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId && c.TeacherId == userId);
            if (course == null) return null;

            var uploadsFolder = Path.Combine("wwwroot", "uploads", "courses", courseId.ToString());
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new CourseAttachment
            {
                FileName = file.FileName,
                FilePath = Path.Combine("uploads", "courses", courseId.ToString(), uniqueFileName),
                FileType = file.ContentType,
                FileSize = file.Length,
                CourseId = courseId
            };

            _context.CourseAttachments.Add(attachment);
            await _context.SaveChangesAsync();

            return new AttachmentDto
            {
                Id = attachment.Id,
                FileName = attachment.FileName,
                FileUrl = "/" + attachment.FilePath.Replace("\\", "/"),
                FileType = attachment.FileType,
                FileSize = attachment.FileSize,
                UploadDate = attachment.UploadDate
            };
        }

        public async Task<IEnumerable<AttachmentDto>> GetAttachmentsAsync(int courseId)
        {   
            return await _context.CourseAttachments
                .Where(a => a.CourseId == courseId)
                .Select(a => new AttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    FileUrl = "/" + a.FilePath.Replace("\\", "/"),
                    FileType = a.FileType,
                    FileSize = a.FileSize,
                    UploadDate = a.UploadDate
                })
                .ToListAsync();
        }   

        public async Task<bool> DeleteAttachmentAsync(int attachmentId, string userId)
        {
            var attachment = await _context.CourseAttachments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.Id == attachmentId && a.Course.TeacherId == userId);

            if (attachment == null) return false;

            var filePath = Path.Combine("wwwroot", attachment.FilePath);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }

            _context.CourseAttachments.Remove(attachment);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
