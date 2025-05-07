using ELearningPlatform.API.Models;

namespace ELearningPlatform.API.DTOs
{
    public class LessonDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string VideoUrl { get; set; }
        public int Order { get; set; }
        public int DurationInMinutes { get; set; }
        public string Type { get; set; }
    }

    public class CreateLessonDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string VideoUrl { get; set; }
        public int Order { get; set; }
        public int DurationInMinutes { get; set; }
        public int ModuleId { get; set; }
        public LessonType Type { get; set; }
    }

    public class UpdateLessonDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string VideoUrl { get; set; }
        public int? Order { get; set; }
        public int? DurationInMinutes { get; set; }
        public LessonType? Type { get; set; }
    }
}    