using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class Quiz
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public int TimeLimit { get; set; } // in minutes
        public int PassingScore { get; set; } // percentage
        public int PointsToEarn { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Question> Questions { get; set; }
        public ICollection<UserQuiz> UserQuizzes { get; set; }
    }
}
