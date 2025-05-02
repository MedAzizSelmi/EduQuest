using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public interface IGamificationService
    {
        // Badges
        Task<IEnumerable<BadgeDto>> GetUserBadgesAsync(string userId);
        Task<IEnumerable<BadgeCategoryDto>> GetBadgeCategoriesAsync();
        Task<BadgeDto> GetBadgeByIdAsync(int id, string userId);
        Task<bool> AwardBadgeToUserAsync(int badgeId, string userId);
        
        // Certificates
        Task<IEnumerable<Certificate>> GetUserCertificatesAsync(string userId);
        Task<Certificate> GetCertificateByIdAsync(int id);
        Task<Certificate> GetCertificateByVerificationCodeAsync(string verificationCode);
        
        // Levels
        Task<LevelDetailsDto> GetUserLevelDetailsAsync(string userId);
        Task<int> CalculateUserLevelAsync(int points);
        Task<bool> UpdateUserPointsAsync(string userId, int pointsToAdd);
        
        // Leaderboard
        Task<IEnumerable<LeaderboardEntryDto>> GetLeaderboardAsync(string type, int limit, string userId);
        
        // Coding Games
        Task<IEnumerable<CodingGameDto>> GetCodingGamesAsync(string userId);
        Task<CodingGameDetailDto> GetCodingGameByIdAsync(int id, string userId);
        Task<CodingGameResultDto> SubmitCodingGameSolutionAsync(int id, string userId, string solution);
    }
}
