using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using ELearningPlatform.API.Models;

namespace ELearningPlatform.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/gamification")]
    public class GamificationController : ControllerBase
    {
        private readonly IGamificationService _gamificationService;

        public GamificationController(IGamificationService gamificationService)
        {
            _gamificationService = gamificationService;
        }

        // Badges
        [HttpGet("badges")]
        public async Task<ActionResult<IEnumerable<BadgeDto>>> GetUserBadges()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var badges = await _gamificationService.GetUserBadgesAsync(userId);
            return Ok(badges);
        }

        [HttpGet("badges/categories")]
        public async Task<ActionResult<IEnumerable<BadgeCategoryDto>>> GetBadgeCategories()
        {
            var categories = await _gamificationService.GetBadgeCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("badges/{id}")]
        public async Task<ActionResult<BadgeDto>> GetBadgeById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var badge = await _gamificationService.GetBadgeByIdAsync(id, userId);
            if (badge == null) return NotFound();
            return Ok(badge);
        }

        [Authorize(Roles = "Admin,Teacher")]
        [HttpPost("badges/{id}/award/{targetUserId}")]
        public async Task<ActionResult> AwardBadgeToUser(int id, string targetUserId)
        {
            var result = await _gamificationService.AwardBadgeToUserAsync(id, targetUserId);
            if (!result) return BadRequest("Failed to award badge");
            return Ok();
        }

        // Certificates
        [HttpGet("certificates")]
        public async Task<ActionResult<IEnumerable<Certificate>>> GetUserCertificates()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var certificates = await _gamificationService.GetUserCertificatesAsync(userId);
            return Ok(certificates);
        }

        [HttpGet("certificates/{id}")]
        public async Task<ActionResult<Certificate>> GetCertificateById(int id)
        {
            var certificate = await _gamificationService.GetCertificateByIdAsync(id);
            if (certificate == null) return NotFound();
            
            // Check if user has access to this certificate
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue("role");
            
            if (certificate.UserId != userId && role != "Admin" && role != "Teacher")
            {
                return Forbid();
            }
            
            return Ok(certificate);
        }

        [AllowAnonymous]
        [HttpGet("certificates/verify/{verificationCode}")]
        public async Task<ActionResult<Certificate>> VerifyCertificate(string verificationCode)
        {
            var certificate = await _gamificationService.GetCertificateByVerificationCodeAsync(verificationCode);
            if (certificate == null) return NotFound();
            return Ok(certificate);
        }

        // Levels
        [HttpGet("levels")]
        public async Task<ActionResult<LevelDetailsDto>> GetUserLevelDetails()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var levelDetails = await _gamificationService.GetUserLevelDetailsAsync(userId);
            if (levelDetails == null) return NotFound();
            return Ok(levelDetails);
        }

        // Leaderboard
        [HttpGet("leaderboard")]
        public async Task<ActionResult<IEnumerable<LeaderboardEntryDto>>> GetLeaderboard(
            [FromQuery] string type = "global", 
            [FromQuery] int limit = 10)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var leaderboard = await _gamificationService.GetLeaderboardAsync(type, limit, userId);
            return Ok(leaderboard);
        }

        // Coding Games
        [HttpGet("coding-games")]
        public async Task<ActionResult<IEnumerable<CodingGameDto>>> GetCodingGames()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var games = await _gamificationService.GetCodingGamesAsync(userId);
            return Ok(games);
        }

        [HttpGet("coding-games/{id}")]
        public async Task<ActionResult<CodingGameDetailDto>> GetCodingGameById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var game = await _gamificationService.GetCodingGameByIdAsync(id, userId);
            if (game == null) return NotFound();
            return Ok(game);
        }

        [HttpPost("coding-games/{id}/submit")]
        public async Task<ActionResult<CodingGameResultDto>> SubmitCodingGameSolution(
            int id, 
            SubmitCodingGameDto submitDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _gamificationService.SubmitCodingGameSolutionAsync(id, userId, submitDto.Solution);
            if (result == null) return NotFound();
            return Ok(result);
        }
    }
}
