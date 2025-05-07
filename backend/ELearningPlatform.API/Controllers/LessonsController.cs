// Controllers/LessonsController.cs
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost]
        public async Task<ActionResult<Lesson>> CreateLesson(CreateLessonDto lessonDto)
        {
            var lesson = await _lessonService.CreateLesson(lessonDto);
            return CreatedAtAction(nameof(GetLesson), new { id = lesson.Id }, lesson);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Lesson>> GetLesson(int id)
        {
            var lesson = await _lessonService.GetLesson(id);
            if (lesson == null) return NotFound();
            return Ok(lesson);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Lesson>> UpdateLesson(int id, UpdateLessonDto lessonDto)
        {
            var lesson = await _lessonService.UpdateLesson(id, lessonDto);
            if (lesson == null) return NotFound();
            return Ok(lesson);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var result = await _lessonService.DeleteLesson(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}