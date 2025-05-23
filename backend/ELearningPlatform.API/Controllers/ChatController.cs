using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ELearningPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _dbContext;

        public ChatController(IHttpClientFactory httpClientFactory, ApplicationDbContext dbContext)
        {
            _httpClient = httpClientFactory.CreateClient();
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ChatRequest request)
        {
            try
            {

                string context = await GetContextFromDatabase(request);
                if (string.IsNullOrEmpty(context))
                {
                    return BadRequest("No relevant context found in the database");
                }
                
                request.Context = context;
                
                var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/chat", request);

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

                var result = await response.Content.ReadFromJsonAsync<ChatResponse>();
                return Ok(result);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal error:{e.Message}");
            };
        }

        private async Task<string> GetContextFromDatabase(ChatRequest request)
        {
            // Specific context first
            if (request.LessonId.HasValue)
            {
                var lesson = await _dbContext.Lessons
                    .Where(x => x.Id == request.LessonId.Value)
                    .Select(x => $"LESSON CONTEXT:\nTitle: {x.Title}\nContent: {x.Content}")
                    .FirstOrDefaultAsync();
                if (!string.IsNullOrEmpty(lesson)) return lesson;
            }

            if (request.ModuleId.HasValue)
            {
                var moduleContent = await _dbContext.Modules
                    .Where(x => x.Id == request.ModuleId.Value)
                    .Include(x => x.Lessons)
                    .Select(x => new {
                        Description = x.Description,
                        Lessons = x.Lessons.Select(l => $"{l.Title}: {l.Content}")
                    })
                    .FirstOrDefaultAsync();
            
                if (moduleContent != null)
                {
                    return $"MODULE CONTEXT:\n{moduleContent.Description}\n\n" +
                           $"LESSONS:\n{string.Join("\n\n", moduleContent.Lessons)}";
                }
            }

            if (request.CourseId.HasValue)
            {
                var course = await _dbContext.Courses
                    .Where(x => x.Id == request.CourseId.Value)
                    .Include(x => x.Modules)
                    .ThenInclude(m => m.Lessons)
                    .FirstOrDefaultAsync();
            
                if (course != null)
                {
                    return $"COURSE CONTEXT:\n{course.Title}\n{course.Description}\n\n" +
                           $"Available modules: {string.Join(", ", course.Modules.Select(m => m.Title))}";
                }
            }

            // Default platform knowledge when no specific context
            return @"EDUQUEST PLATFORM KNOWLEDGE:
EduQuest is an online learning platform offering:
- Interactive courses
- Quizzes and coding exercises
- Technology education (Angular, React, JavaScript)
- Progress tracking
- Gamification features";
        }
    }
    
    public class ChatRequest
    {
        public string Context { get; set; }
        public string Question { get; set; }
        public string? Conversation_Id { get; set; }
        public int Max_Tokens { get; set; } = 2048;
        public double Temperature { get; set; } = 0.7;
        public string? System_Prompt { get; set; }
        public int? LessonId { get; set; }
        public int? ModuleId { get; set; }
        public int? CourseId { get; set; }
    }

    public class ChatResponse
    {
        public string Answer { get; set; }
        public string Conversation_Id { get; set; }
        public int Tokens_Used { get; set; }
        public double Processing_Time { get; set; }
    }
}