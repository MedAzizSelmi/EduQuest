using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class GamificationService : IGamificationService
    {
        private readonly ApplicationDbContext _context;

        public GamificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Badges
        public async Task<IEnumerable<BadgeDto>> GetUserBadgesAsync(string userId)
        {
            // Get all badges
            var allBadges = await _context.Badges.ToListAsync();
            
            // Get user's earned badges
            var userBadges = await _context.UserBadges
                .Where(ub => ub.UserId == userId)
                .ToListAsync();
            
            // Map to DTOs
            return allBadges.Select(badge => new BadgeDto
            {
                Id = badge.Id,
                Name = badge.Name,
                Description = badge.Description,
                ImageUrl = badge.ImageUrl,
                Category = badge.Category,
                Points = badge.Points,
                Criteria = badge.Criteria,
                IsEarned = userBadges.Any(ub => ub.BadgeId == badge.Id),
                EarnedDate = userBadges.FirstOrDefault(ub => ub.BadgeId == badge.Id)?.EarnedDate
            });
        }

        public async Task<IEnumerable<BadgeCategoryDto>> GetBadgeCategoriesAsync()
        {
            var badges = await _context.Badges.ToListAsync();
            
            return badges
                .GroupBy(b => b.Category)
                .Select(g => new BadgeCategoryDto
                {
                    Name = g.Key,
                    Description = $"{g.Key} badges", // This would be replaced with actual descriptions
                    Badges = g.Select(b => new BadgeDto
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Description = b.Description,
                        ImageUrl = b.ImageUrl,
                        Category = b.Category,
                        Points = b.Points,
                        Criteria = b.Criteria,
                        IsEarned = false // This will be updated when getting user badges
                    }).ToList()
                });
        }

        public async Task<BadgeDto> GetBadgeByIdAsync(int id, string userId)
        {
            var badge = await _context.Badges.FindAsync(id);
            if (badge == null) return null;
            
            var userBadge = await _context.UserBadges
                .FirstOrDefaultAsync(ub => ub.BadgeId == id && ub.UserId == userId);
            
            return new BadgeDto
            {
                Id = badge.Id,
                Name = badge.Name,
                Description = badge.Description,
                ImageUrl = badge.ImageUrl,
                Category = badge.Category,
                Points = badge.Points,
                Criteria = badge.Criteria,
                IsEarned = userBadge != null,
                EarnedDate = userBadge?.EarnedDate
            };
        }

        public async Task<bool> AwardBadgeToUserAsync(int badgeId, string userId)
        {
            // Check if user already has this badge
            var existingBadge = await _context.UserBadges
                .FirstOrDefaultAsync(ub => ub.BadgeId == badgeId && ub.UserId == userId);
                
            if (existingBadge != null) return false; // Already awarded
            
            var badge = await _context.Badges.FindAsync(badgeId);
            if (badge == null) return false;
            
            var userBadge = new UserBadge
            {
                UserId = userId,
                BadgeId = badgeId,
                EarnedDate = DateTime.UtcNow
            };
            
            _context.UserBadges.Add(userBadge);
            
            // Update user points
            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.Points += badge.Points;
                user.Level = CalculateUserLevelAsync(user.Points).Result;
            }
            
            return await _context.SaveChangesAsync() > 0;
        }

        // Certificates
        public async Task<IEnumerable<Certificate>> GetUserCertificatesAsync(string userId)
        {
            return await _context.Certificates
                .Include(c => c.Course)
                .Where(c => c.UserId == userId)
                .ToListAsync();
        }

        public async Task<Certificate> GetCertificateByIdAsync(int id)
        {
            return await _context.Certificates
                .Include(c => c.Course)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Certificate> GetCertificateByVerificationCodeAsync(string verificationCode)
        {
            return await _context.Certificates
                .Include(c => c.Course)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.CertificateUrl.Contains(verificationCode));
        }

        // Levels
        public async Task<LevelDetailsDto> GetUserLevelDetailsAsync(string userId)
        {
            var user = await _context.Users
                .Include(u => u.UserCourses)
                .Include(u => u.UserQuizzes)
                .Include(u => u.UserExams)
                .Include(u => u.UserBadges)
                    .ThenInclude(ub => ub.Badge)
                .Include(u => u.UserCodingGames)
                .FirstOrDefaultAsync(u => u.Id == userId);
                
            if (user == null) return null;
            
            // Calculate points breakdown
            int coursePoints = user.UserCourses.Sum(uc => uc.PointsEarned);
            int quizPoints = user.UserQuizzes.Sum(uq => uq.PointsEarned);
            int examPoints = user.UserExams.Sum(ue => ue.PointsEarned);
            int badgePoints = user.UserBadges.Sum(ub => ub.Badge.Points);
            int codingGamePoints = user.UserCodingGames.Sum(ucg => ucg.PointsEarned);
            
            // Calculate level thresholds
            int currentLevel = user.Level;
            int pointsForCurrentLevel = (currentLevel - 1) * 100; // Simple formula: level * 100
            int pointsForNextLevel = currentLevel * 100;
            
            return new LevelDetailsDto
            {
                CurrentLevel = currentLevel,
                LevelTitle = $"Level {currentLevel}",
                LevelDescription = GetLevelDescription(currentLevel),
                CurrentPoints = user.Points,
                PointsForCurrentLevel = pointsForCurrentLevel,
                PointsForNextLevel = pointsForNextLevel,
                Benefits = GetLevelBenefits(currentLevel),
                PointsBreakdown = new PointsBreakdownDto
                {
                    Courses = coursePoints,
                    Quizzes = quizPoints,
                    Exams = examPoints,
                    Badges = badgePoints,
                    CodingGames = codingGamePoints
                }
            };
        }

        public async Task<int> CalculateUserLevelAsync(int points)
        {
            // Simple level calculation: 1 level per 100 points
            return (points / 100) + 1;
        }

        public async Task<bool> UpdateUserPointsAsync(string userId, int pointsToAdd)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;
            
            user.Points += pointsToAdd;
            user.Level = await CalculateUserLevelAsync(user.Points);
            
            return await _context.SaveChangesAsync() > 0;
        }

        // Leaderboard
        public async Task<IEnumerable<LeaderboardEntryDto>> GetLeaderboardAsync(string type, int limit, string userId)
        {
            IQueryable<AppUser> query = _context.Users;
            
            // Filter by type
            if (type == "friends")
            {
                // In a real app, this would filter by user's friends
                // For now, just return a smaller subset
                query = query.Take(20);
            }
            else if (type == "course" && int.TryParse(type.Split('-').LastOrDefault(), out int courseId))
            {
                // Filter by course enrollments
                query = query.Where(u => u.UserCourses.Any(uc => uc.CourseId == courseId));
            }
            
            // Get top users by points
            var topUsers = await query
                .OrderByDescending(u => u.Points)
                .ThenByDescending(u => u.Level)
                .Take(limit)
                .ToListAsync();
                
            // Check if current user is in the list
            var currentUser = topUsers.FirstOrDefault(u => u.Id == userId);
            bool isCurrentUserInTop = currentUser != null;
            
            // If current user is not in top, add them to the list
            if (!isCurrentUserInTop && !string.IsNullOrEmpty(userId))
            {
                currentUser = await _context.Users.FindAsync(userId);
                if (currentUser != null)
                {
                    topUsers.Add(currentUser);
                }
            }
            
            // Map to DTOs
            return topUsers.Select(u => new LeaderboardEntryDto
            {
                UserId = u.Id,
                Username = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                ProfilePicture = u.ProfilePicture,
                Level = u.Level,
                Points = u.Points,
                IsCurrentUser = u.Id == userId
            })
            .OrderByDescending(u => u.Points)
            .ThenByDescending(u => u.Level);
        }

        // Coding Games
        public async Task<IEnumerable<CodingGameDto>> GetCodingGamesAsync(string userId)
        {
            var games = await _context.CodingGames.ToListAsync();
            var userGames = await _context.UserCodingGames
                .Where(ucg => ucg.UserId == userId)
                .ToListAsync();
                
            return games.Select(game => new CodingGameDto
            {
                Id = game.Id,
                Title = game.Title,
                Description = game.Description,
                Category = game.Category,
                Difficulty = game.Difficulty,
                ImageUrl = game.ImageUrl,
                PointsToEarn = game.PointsToEarn,
                EstimatedTime = game.EstimatedTime,
                PlayersCompleted = _context.UserCodingGames.Count(ucg => ucg.CodingGameId == game.Id && ucg.IsCompleted),
                IsCompleted = userGames.Any(ug => ug.CodingGameId == game.Id && ug.IsCompleted),
                Requirements = JsonSerializer.Deserialize<List<string>>(game.Requirements ?? "[]"),
                Examples = JsonSerializer.Deserialize<List<CodingGameExampleDto>>(game.Examples ?? "[]")
            });
        }

        public async Task<CodingGameDetailDto> GetCodingGameByIdAsync(int id, string userId)
        {
            var game = await _context.CodingGames.FindAsync(id);
            if (game == null) return null;
            
            var userGame = await _context.UserCodingGames
                .FirstOrDefaultAsync(ucg => ucg.CodingGameId == id && ucg.UserId == userId);
                
            return new CodingGameDetailDto
            {
                Id = game.Id,
                Title = game.Title,
                Description = game.Description,
                Category = game.Category,
                Difficulty = game.Difficulty,
                ImageUrl = game.ImageUrl,
                PointsToEarn = game.PointsToEarn,
                EstimatedTime = game.EstimatedTime,
                StarterCode = game.StarterCode,
                PlayersCompleted = _context.UserCodingGames.Count(ucg => ucg.CodingGameId == game.Id && ucg.IsCompleted),
                IsCompleted = userGame?.IsCompleted ?? false,
                Requirements = JsonSerializer.Deserialize<List<string>>(game.Requirements ?? "[]"),
                Examples = JsonSerializer.Deserialize<List<CodingGameExampleDto>>(game.Examples ?? "[]")
            };
        }

        public async Task<CodingGameResultDto> SubmitCodingGameSolutionAsync(int id, string userId, string solution)
        {
            var game = await _context.CodingGames.FindAsync(id);
            if (game == null) return null;
            
            // In a real application, this would execute the code against test cases
            // For now, we'll simulate a result
            bool allPassed = true;
            var testResults = new List<TestResultDto>
            {
                new TestResultDto { Passed = true, Input = "Test 1", Expected = "Expected 1", Actual = "Expected 1" },
                new TestResultDto { Passed = true, Input = "Test 2", Expected = "Expected 2", Actual = "Expected 2" }
            };
            
            // Update or create user coding game record
            var userGame = await _context.UserCodingGames
                .FirstOrDefaultAsync(ucg => ucg.CodingGameId == id && ucg.UserId == userId);
                
            if (userGame == null)
            {
                userGame = new UserCodingGame
                {
                    UserId = userId,
                    CodingGameId = id,
                    Solution = solution,
                    AttemptsCount = 1
                };
                _context.UserCodingGames.Add(userGame);
            }
            else
            {
                userGame.Solution = solution;
                userGame.AttemptsCount++;
            }
            
            // Award points if all tests passed and not already completed
            var badgesEarned = new List<BadgeDto>();
            int pointsEarned = 0;
            
            if (allPassed && !userGame.IsCompleted)
            {
                userGame.IsCompleted = true;
                userGame.CompletedDate = DateTime.UtcNow;
                userGame.Score = 100;
                userGame.PointsEarned = game.PointsToEarn;
                pointsEarned = game.PointsToEarn;
                
                // Update user points
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.Points += pointsEarned;
                    user.Level = await CalculateUserLevelAsync(user.Points);
                }
                
                // Check for badges to award
                // For example, award a badge for completing first coding game
                var firstGameBadge = await _context.Badges
                    .FirstOrDefaultAsync(b => b.Name == "First Code Challenge");
                    
                if (firstGameBadge != null)
                {
                    var hasBadge = await _context.UserBadges
                        .AnyAsync(ub => ub.BadgeId == firstGameBadge.Id && ub.UserId == userId);
                        
                    if (!hasBadge)
                    {
                        var userBadge = new UserBadge
                        {
                            UserId = userId,
                            BadgeId = firstGameBadge.Id,
                            EarnedDate = DateTime.UtcNow
                        };
                        
                        _context.UserBadges.Add(userBadge);
                        
                        // Add badge to result
                        badgesEarned.Add(new BadgeDto
                        {
                            Id = firstGameBadge.Id,
                            Name = firstGameBadge.Name,
                            Description = firstGameBadge.Description,
                            ImageUrl = firstGameBadge.ImageUrl,
                            Category = firstGameBadge.Category,
                            Points = firstGameBadge.Points,
                            Criteria = firstGameBadge.Criteria,
                            IsEarned = true,
                            EarnedDate = DateTime.UtcNow
                        });
                    }
                }
            }
            
            await _context.SaveChangesAsync();
            
            return new CodingGameResultDto
            {
                AllTestsPassed = allPassed,
                TestResults = testResults,
                PointsEarned = pointsEarned,
                BadgesEarned = badgesEarned
            };
        }

        // Helper methods
        private string GetLevelDescription(int level)
        {
            switch (level)
            {
                case 1:
                    return "Beginner learner. Just starting your journey.";
                case 2:
                    return "Novice learner. Building foundational knowledge.";
                case 3:
                    return "Intermediate learner. Expanding your skills.";
                case 4:
                    return "Advanced learner. Deepening your expertise.";
                case 5:
                    return "Expert learner. Mastering complex concepts.";
                default:
                    return level <= 10 
                        ? $"Level {level} learner. Continuing to grow your knowledge." 
                        : "Master learner. A true educational champion!";
            }
        }

        private List<string> GetLevelBenefits(int level)
        {
            var benefits = new List<string>
            {
                "Access to basic courses and quizzes"
            };
            
            if (level >= 2)
            {
                benefits.Add("Unlock intermediate courses");
            }
            
            if (level >= 3)
            {
                benefits.Add("Access to coding challenges");
                benefits.Add("Ability to participate in forums");
            }
            
            if (level >= 5)
            {
                benefits.Add("Access to advanced courses");
                benefits.Add("Exclusive webinars");
            }
            
            if (level >= 10)
            {
                benefits.Add("Mentor status");
                benefits.Add("Beta access to new features");
            }
            
            return benefits;
        }
    }
}
