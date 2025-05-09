using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class LessonService : ILessonService
    {
        private readonly ApplicationDbContext _context;

        public LessonService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LessonDto> CreateLesson(CreateLessonDto lessonDto)
        {
            var lesson = new Lesson
            {
                Title = lessonDto.Title,
                Content = lessonDto.Content,
                VideoUrl = lessonDto.VideoUrl,
                Order = lessonDto.Order,
                DurationInMinutes = lessonDto.DurationInMinutes,
                ModuleId = lessonDto.ModuleId,
                Type = lessonDto.Type,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            return MapToLessonDto(lesson);
        }

        public async Task<LessonDto> GetLesson(int id)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Module)
                .FirstOrDefaultAsync(l => l.Id == id);

            return lesson == null ? null : MapToLessonDto(lesson);
        }

        public async Task<List<LessonDto>> GetLessonsByModule(int courseId, int moduleId)
        {
            var lessons = await _context.Lessons
                .Include(l => l.Module)
                .Where(l => l.ModuleId == moduleId && l.Module.CourseId == courseId)
                .ToListAsync();

            return lessons.Select(MapToLessonDto).ToList();
        }

        public async Task<bool> DeleteLesson(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return false;

            _context.Lessons.Remove(lesson);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<LessonDto> UpdateLesson(int id, UpdateLessonDto lessonDto)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return null;

            lesson.Title = lessonDto.Title ?? lesson.Title;
            lesson.Content = lessonDto.Content ?? lesson.Content;
            lesson.VideoUrl = lessonDto.VideoUrl ?? lesson.VideoUrl;
            lesson.Order = lessonDto.Order ?? lesson.Order;
            lesson.DurationInMinutes = lessonDto.DurationInMinutes ?? lesson.DurationInMinutes;
            lesson.Type = lessonDto.Type ?? lesson.Type;
            lesson.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToLessonDto(lesson);
        }

        private LessonDto MapToLessonDto(Lesson lesson)
        {
            return new LessonDto
            {
                Id = lesson.Id,
                Title = lesson.Title,
                Content = lesson.Content,
                VideoUrl = lesson.VideoUrl,
                Order = lesson.Order,
                DurationInMinutes = lesson.DurationInMinutes,
                ModuleId = lesson.ModuleId,
                CreatedAt = lesson.CreatedAt,
                UpdatedAt = lesson.UpdatedAt,
                Type = lesson.Type
            };
        }
    }
}