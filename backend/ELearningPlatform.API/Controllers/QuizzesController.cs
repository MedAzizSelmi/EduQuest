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
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizzesController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzesByCourse(int courseId)
        {
            var quizzes = await _quizService.GetQuizzesByCourseIdAsync(courseId);
            return Ok(quizzes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuizDto>> GetQuiz(int id)
        {
            var quiz = await _quizService.GetQuizByIdAsync(id);
            if (quiz == null) return NotFound();
            return Ok(quiz);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuiz(CreateQuizDto quizDto)
        {
            var quiz = await _quizService.CreateQuizAsync(quizDto);
            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Quiz>> UpdateQuiz(int id, UpdateQuizDto quizDto)
        {
            var quiz = await _quizService.UpdateQuizAsync(id, quizDto);
            if (quiz == null) return NotFound();
            return Ok(quiz);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            var result = await _quizService.DeleteQuizAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Student")]
        [HttpPost("{id}/submit")]
        public async Task<ActionResult<QuizResultDto>> SubmitQuiz(int id, SubmitQuizDto submitQuizDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _quizService.SubmitQuizAsync(id, userId, submitQuizDto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("results")]
        public async Task<ActionResult<IEnumerable<QuizResultDto>>> GetUserQuizResults()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var results = await _quizService.GetUserQuizResultsAsync(userId);
            return Ok(results);
        }

        [Authorize]
        [HttpGet("course/{courseId}/results")]
        public async Task<ActionResult<IEnumerable<QuizResultDto>>> GetQuizResultsByCourse(int courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var results = await _quizService.GetQuizResultsByCourseIdAsync(courseId, userId);
            return Ok(results);
        }
    }
}
