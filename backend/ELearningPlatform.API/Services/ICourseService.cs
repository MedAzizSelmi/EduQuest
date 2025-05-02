using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetCoursesAsync(string userId = null);
        Task<CourseDto> GetCourseByIdAsync(int id);
        Task<Course> CreateCourseAsync(CreateCourseDto courseDto, string teacherId);
        Task<Course> UpdateCourseAsync(int id, UpdateCourseDto courseDto);
        Task<bool> DeleteCourseAsync(int id);
        Task<bool> EnrollUserInCourseAsync(string userId, int courseId);
        Task<IEnumerable<CourseDto>> GetTeacherCoursesAsync(string teacherId);
        Task<IEnumerable<CourseDto>> GetStudentCoursesAsync(string studentId);
    }
}
