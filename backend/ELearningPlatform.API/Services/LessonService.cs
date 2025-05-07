// Services/LessonService.cs
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

        public async Task<Lesson> CreateLesson(CreateLessonDto lessonDto)
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

            return lesson;
        }

        public async Task<Lesson> GetLesson(int id)
        {
            return await _context.Lessons
                .Include(l => l.Module)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<bool> DeleteLesson(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return false;

            _context.Lessons.Remove(lesson);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Lesson> UpdateLesson(int id, UpdateLessonDto lessonDto)
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
            return lesson;
        }
    }
}