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
    public class ExamsController : ControllerBase
    {
        private readonly IExamService _examService;

        public ExamsController(IExamService examService)
        {
            _examService = examService;
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<ExamDto>>> GetExamsByCourse(int courseId)
        {
            var exams = await _examService.GetExamsByCourseIdAsync(courseId);
            return Ok(exams);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> GetExam(int id)
        {
            var exam = await _examService.GetExamByIdAsync(id);
            if (exam == null) return NotFound();
            return Ok(exam);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost]
        public async Task<ActionResult<Exam>> CreateExam(CreateExamDto examDto)
        {
            var exam = await _examService.CreateExamAsync(examDto);
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<Exam>> UpdateExam(int id, UpdateExamDto examDto)
        {
            var exam = await _examService.UpdateExamAsync(id, examDto);
            if (exam == null) return NotFound();
            return Ok(exam);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteExam(int id)
        {
            var result = await _examService.DeleteExamAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
        
        [HttpGet("{examId}/questions")]
        public async Task<ActionResult<IEnumerable<QuestionDto>>> GetQuestionsByExam(int examId)
        {
            var questions = await _examService.GetQuestionsByExamIdAsync(examId);
            if (questions == null || !questions.Any())
                return NotFound();
            return Ok(questions);
        }
        
        [Authorize(Roles = "Teacher,Admin")]
        [HttpPost("questions/create")]
        public async Task<ActionResult<Question>> CreateQuestion(CreateQuestionDto questionDto)
        {
            var question = await _examService.CreateQuestionAsync(questionDto);
            return CreatedAtAction(nameof(GetQuestionsByExam), new { examId = question.ExamId }, question);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpPut("{examId}/questions/{id}")]
        public async Task<ActionResult<Question>> UpdateQuestion(int id, UpdateQuestionDto questionDto)
        {
            var question = await _examService.UpdateQuestionAsync(id, questionDto);
            if (question == null) return NotFound();
            return Ok(question);
        }

        [Authorize(Roles = "Teacher,Admin")]
        [HttpDelete("{examId}/questions/{id}")]
        public async Task<ActionResult> DeleteQuestion(int id)
        {
            var result = await _examService.DeleteQuestionAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Student")]
        [HttpPost("{id}/submit")]
        public async Task<ActionResult<ExamResultDto>> SubmitExam(int id, SubmitExamDto submitExamDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _examService.SubmitExamAsync(id, userId, submitExamDto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [Authorize]
        [HttpGet("results")]
        public async Task<ActionResult<IEnumerable<ExamResultDto>>> GetUserExamResults()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var results = await _examService.GetUserExamResultsAsync(userId);
            return Ok(results);
        }

        [Authorize]
        [HttpGet("course/{courseId}/results")]
        public async Task<ActionResult<IEnumerable<ExamResultDto>>> GetExamResultsByCourse(int courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var results = await _examService.GetExamResultsByCourseIdAsync(courseId, userId);
            return Ok(results);
        }
    }
}
