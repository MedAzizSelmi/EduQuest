using ELearningPlatform.API.DTOs;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetStudentDashboardAsync(string userId);
        Task<TeacherDashboardDto> GetTeacherDashboardAsync(string teacherId);
        Task<AdminDashboardDto> GetAdminDashboardAsync();
    }
}
