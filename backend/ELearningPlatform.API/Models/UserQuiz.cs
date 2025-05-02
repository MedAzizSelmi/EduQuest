using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class UserQuiz
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public int PointsEarned { get; set; }
        public int AttemptsCount { get; set; } = 1;
    }
}
