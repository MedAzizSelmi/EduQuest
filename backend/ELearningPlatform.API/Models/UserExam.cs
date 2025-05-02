using System;

namespace ELearningPlatform.API.Models
{
    public class UserExam
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public int PointsEarned { get; set; }
    }
}
