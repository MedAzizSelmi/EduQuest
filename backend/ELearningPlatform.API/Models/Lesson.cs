using System;

namespace ELearningPlatform.API.Models
{
    public class Lesson
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string VideoUrl { get; set; }
        public int Order { get; set; }
        public int DurationInMinutes { get; set; }
        public int ModuleId { get; set; }
        public Module Module { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public LessonType Type { get; set; }
    }

    public enum LessonType
    {
        Video,
        Text,
        Interactive,
        CodingExercise
    }
}
