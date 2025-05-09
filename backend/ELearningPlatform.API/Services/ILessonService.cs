// Services/ILessonService.cs
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface ILessonService
    {
        Task<LessonDto> CreateLesson(CreateLessonDto lessonDto);
        Task<LessonDto> GetLesson(int id);
        Task<List<LessonDto>> GetLessonsByModule(int courseId, int moduleId);
        Task<bool> DeleteLesson(int id);
        Task<LessonDto> UpdateLesson(int id, UpdateLessonDto lessonDto);
    }
}