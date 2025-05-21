using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace ELearningPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public ChatController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ChatRequest request)
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/chat", request);
            
            if(!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var result = await response.Content.ReadFromJsonAsync<ChatResponse>();
            return Ok(result);
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
    }

    public class ChatResponse
    {
        public string Answer { get; set; }
        public string Conversation_Id { get; set; }
        public int Tokens_Used { get; set; }
        public double Processing_Time { get; set; }
    }
}