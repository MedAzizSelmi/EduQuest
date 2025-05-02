using System;

namespace ELearningPlatform.API.Models
{
    public class Badge
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public string Category { get; set; }
        public int Points { get; set; }
        public string Criteria { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
