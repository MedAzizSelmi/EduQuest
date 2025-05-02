using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue("role");

            if (role == UserRole.Student.ToString())
            {
                var dashboard = await _dashboardService.GetStudentDashboardAsync(userId);
                if (dashboard == null) return NotFound();
                return Ok(dashboard);
            }
            else if (role == UserRole.Teacher.ToString())
            {
                var dashboard = await _dashboardService.GetTeacherDashboardAsync(userId);
                if (dashboard == null) return NotFound();
                return Ok(dashboard);
            }
            else if (role == UserRole.Admin.ToString())
            {
                var dashboard = await _dashboardService.GetAdminDashboardAsync();
                return Ok(dashboard);
            }

            return Forbid();
        }

        [Authorize(Roles = "Student")]
        [HttpGet("student")]
        public async Task<ActionResult<DashboardDto>> GetStudentDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dashboard = await _dashboardService.GetStudentDashboardAsync(userId);
            if (dashboard == null) return NotFound();
            return Ok(dashboard);
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("teacher")]
        public async Task<ActionResult<TeacherDashboardDto>> GetTeacherDashboard()
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var dashboard = await _dashboardService.GetTeacherDashboardAsync(teacherId);
            if (dashboard == null) return NotFound();
            return Ok(dashboard);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<ActionResult<AdminDashboardDto>> GetAdminDashboard()
        {
            var dashboard = await _dashboardService.GetAdminDashboardAsync();
            return Ok(dashboard);
        }
    }
}
