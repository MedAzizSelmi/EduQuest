using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.DTOs
{
    // Badge DTOs
    public class BadgeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public int Points { get; set; }
        public string Criteria { get; set; }
        public bool IsEarned { get; set; }
        public DateTime? EarnedDate { get; set; }
    }

    public class BadgeCategoryDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<BadgeDto> Badges { get; set; }
    }

    // Coding Game DTOs
    public class CodingGameDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public int PointsToEarn { get; set; }
        public int EstimatedTime { get; set; }
        public int PlayersCompleted { get; set; }
        public bool IsCompleted { get; set; }
        public List<string> Requirements { get; set; }
        public List<CodingGameExampleDto> Examples { get; set; }
    }

    public class CodingGameDetailDto : CodingGameDto
    {
        public string StarterCode { get; set; }
    }

    public class CodingGameExampleDto
    {
        public string Input { get; set; }
        public string Output { get; set; }
        public string Explanation { get; set; }
    }

    public class SubmitCodingGameDto
    {
        public string Solution { get; set; }
    }

    public class CodingGameResultDto
    {
        public bool AllTestsPassed { get; set; }
        public List<TestResultDto> TestResults { get; set; }
        public int PointsEarned { get; set; }
        public List<BadgeDto> BadgesEarned { get; set; }
    }

    public class TestResultDto
    {
        public bool Passed { get; set; }
        public string Input { get; set; }
        public string Expected { get; set; }
        public string Actual { get; set; }
    }

    // Level DTOs
    public class LevelDetailsDto
    {
        public int CurrentLevel { get; set; }
        public string LevelTitle { get; set; }
        public string LevelDescription { get; set; }
        public int CurrentPoints { get; set; }
        public int PointsForCurrentLevel { get; set; }
        public int PointsForNextLevel { get; set; }
        public List<string> Benefits { get; set; }
        public PointsBreakdownDto PointsBreakdown { get; set; }
    }

    public class PointsBreakdownDto
    {
        public int Courses { get; set; }
        public int Quizzes { get; set; }
        public int Exams { get; set; }
        public int Badges { get; set; }
        public int CodingGames { get; set; }
    }

    // Leaderboard DTOs
    public class LeaderboardEntryDto
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePicture { get; set; }
        public int Level { get; set; }
        public int Points { get; set; }
        public bool IsCurrentUser { get; set; }
    }
}
