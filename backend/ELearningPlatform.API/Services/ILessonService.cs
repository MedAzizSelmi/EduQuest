// Services/ILessonService.cs
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface ILessonService
    {
        Task<Lesson> CreateLesson(CreateLessonDto lessonDto);
        Task<Lesson> GetLesson(int id);
        Task<bool> DeleteLesson(int id);
        Task<Lesson> UpdateLesson(int id, UpdateLessonDto lessonDto);
    }
}