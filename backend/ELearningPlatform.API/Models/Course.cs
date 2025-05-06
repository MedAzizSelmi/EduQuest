using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public string TeacherId { get; set; }
        public AppUser Teacher { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public CourseStatus Status { get; set; } = CourseStatus.Draft;
        public int DurationInMinutes { get; set; }
        public int PointsToEarn { get; set; }
        public string Category { get; set; }
        public string Level { get; set; }
        public ICollection<Module> Modules { get; set; }
        public ICollection<Quiz> Quizzes { get; set; }
        public ICollection<Exam> Exams { get; set; }
        public ICollection<UserCourse> UserCourses { get; set; }
        
        public ICollection<CourseAttachment> Attachments { get; set; }
    }
    
    public class CourseAttachment
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
    }

    public enum CourseStatus
    {
        Draft,
        Published,
        Archived
    }
}
