using ELearningPlatform.API.Models;
using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public string TeacherId { get; set; }
        public string TeacherName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Status { get; set; }
        public int DurationInMinutes { get; set; }
        public int PointsToEarn { get; set; }
        public string Category { get; set; }
        public string Level { get; set; }
        public int ModulesCount { get; set; }
        public int EnrolledStudentsCount { get; set; }
        public List<ModuleDto> Modules { get; set; }
        public List<QuizDto> Quizzes { get; set; }
        public List<ExamDto> Exams { get; set; }
        public int Progress { get; set; }
        public bool IsCompleted { get; set; }
        public int PointsEarned { get; set; }
        public DateTime EnrollmentDate { get; set; }
        public DateTime? CompletionDate { get; set; }
    }

    public class CreateCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public int DurationInMinutes { get; set; }
        public int PointsToEarn { get; set; }
        public string Category { get; set; }
        public string Level { get; set; }
    }

    public class UpdateCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public CourseStatus? Status { get; set; }
        public int? DurationInMinutes { get; set; }
        public int? PointsToEarn { get; set; }
        public string Category { get; set; }
        public string Level { get; set; }
    }

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
    
    public class AttachmentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
