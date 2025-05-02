using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface IExamService
    {
        Task<IEnumerable<ExamDto>> GetExamsByCourseIdAsync(int courseId);
        Task<ExamDto> GetExamByIdAsync(int id);
        Task<Exam> CreateExamAsync(CreateExamDto examDto);
        Task<Exam> UpdateExamAsync(int id, UpdateExamDto examDto);
        Task<bool> DeleteExamAsync(int id);
        Task<ExamResultDto> SubmitExamAsync(int examId, string userId, SubmitExamDto submitExamDto);
        Task<IEnumerable<ExamResultDto>> GetUserExamResultsAsync(string userId);
        Task<IEnumerable<ExamResultDto>> GetExamResultsByCourseIdAsync(int courseId, string userId);
    }
}
