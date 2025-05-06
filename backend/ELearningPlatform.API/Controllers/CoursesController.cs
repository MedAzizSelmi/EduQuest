using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CoursesController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetCourses()
        {
            var courses = await _courseService.GetCoursesAsync();
            return Ok(courses);
        }

        [Authorize]
        [HttpGet("my-courses")]
        public async Task<ActionResult<IEnumerable<CourseDto>>> GetMyCourses()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue("role");

            if (User.IsInRole(UserRole.Teacher.ToString()))
            {
                var courses = await _courseService.GetTeacherCoursesAsync(userId);
                return Ok(courses);
            }
            else if (User.IsInRole(UserRole.Student.ToString()))
            {
                var courses = await _courseService.GetStudentCoursesAsync(userId);
                return Ok(courses);
            }
            else if (User.IsInRole(UserRole.Admin.ToString()))
            {
                var courses = await _courseService.GetCoursesAsync();
                return Ok(courses);
            }

            return Forbid();

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CourseDto>> GetCourse(int id)
        {
            var course = await _courseService.GetCourseByIdAsync(id);
            if (course == null) return NotFound();
            return Ok(course);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse(CreateCourseDto courseDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _courseService.CreateCourseAsync(courseDto, userId);
            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Course>> UpdateCourse(int id, UpdateCourseDto courseDto)
        {
            var course = await _courseService.UpdateCourseAsync(id, courseDto);
            if (course == null) return NotFound();
            return Ok(course);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourse(int id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Student")]
        [HttpPost("{id}/enroll")]
        public async Task<ActionResult> EnrollInCourse(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _courseService.EnrollUserInCourseAsync(userId, id);
            if (!result) return BadRequest("Already enrolled or course not found");
            return Ok();
        }
    }
}
