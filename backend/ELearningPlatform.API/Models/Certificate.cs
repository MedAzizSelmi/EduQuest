using System;

namespace ELearningPlatform.API.Models
{
    public class Certificate
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime IssuedDate { get; set; } = DateTime.UtcNow;
        public string CertificateUrl { get; set; }
    }
}
