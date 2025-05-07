namespace ELearningPlatform.API.DTOs
{
    public class ModuleDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int LessonsCount { get; set; }
        public List<LessonDto> Lessons { get; set; }
    }

    public class CreateModuleDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int CourseId { get; set; }
    }

    public class UpdateModuleDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? Order { get; set; }
    }
}    