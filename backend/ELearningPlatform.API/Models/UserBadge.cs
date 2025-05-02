using System;

namespace ELearningPlatform.API.Models
{
    public class UserBadge
    {
        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int BadgeId { get; set; }
        public Badge Badge { get; set; }
        public DateTime EarnedDate { get; set; } = DateTime.UtcNow;
    }
}
