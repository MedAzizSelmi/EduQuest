using System;

namespace ELearningPlatform.API.Models
{
    public class UserCodingGame
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int CodingGameId { get; set; }
        public CodingGame CodingGame { get; set; }
        public bool IsCompleted { get; set; }
        public string Solution { get; set; }
        public int Score { get; set; }
        public int PointsEarned { get; set; }
        public DateTime CompletedDate { get; set; }
        public int AttemptsCount { get; set; } = 0;
    }
}
