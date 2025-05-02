using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class Module
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Lesson> Lessons { get; set; }
    }
}
