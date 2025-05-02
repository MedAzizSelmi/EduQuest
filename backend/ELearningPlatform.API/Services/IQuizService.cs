using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface IQuizService
    {
        Task<IEnumerable<QuizDto>> GetQuizzesByCourseIdAsync(int courseId);
        Task<QuizDto> GetQuizByIdAsync(int id);
        Task<Quiz> CreateQuizAsync(CreateQuizDto quizDto);
        Task<Quiz> UpdateQuizAsync(int id, UpdateQuizDto quizDto);
        Task<bool> DeleteQuizAsync(int id);
        Task<QuizResultDto> SubmitQuizAsync(int quizId, string userId, SubmitQuizDto submitQuizDto);
        Task<IEnumerable<QuizResultDto>> GetUserQuizResultsAsync(string userId);
        Task<IEnumerable<QuizResultDto>> GetQuizResultsByCourseIdAsync(int courseId, string userId);
    }
}
