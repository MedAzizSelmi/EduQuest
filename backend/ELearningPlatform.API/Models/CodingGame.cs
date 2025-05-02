using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class CodingGame
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public int PointsToEarn { get; set; }
        public int EstimatedTime { get; set; } // in minutes
        public string StarterCode { get; set; }
        public string TestCases { get; set; } // JSON string of test cases
        public string Requirements { get; set; } // JSON string of requirements
        public string Examples { get; set; } // JSON string of examples
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
