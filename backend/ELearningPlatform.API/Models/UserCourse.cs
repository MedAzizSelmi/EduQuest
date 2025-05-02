using System;

namespace ELearningPlatform.API.Models
{
    public class UserCourse
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletionDate { get; set; }
        public int Progress { get; set; } // percentage
        public bool IsCompleted { get; set; }
        public int PointsEarned { get; set; }
    }
}
