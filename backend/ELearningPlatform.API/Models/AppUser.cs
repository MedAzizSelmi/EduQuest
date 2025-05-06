using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Bio { get; set; }
        public UserRole Role { get; set; }
        public int Points { get; set; }
        public int Level { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<UserCourse> UserCourses { get; set; }
        public ICollection<UserQuiz> UserQuizzes { get; set; }
        public ICollection<UserExam> UserExams { get; set; }
        public ICollection<Certificate> Certificates { get; set; }
        
        // Gamification relationships
        public ICollection<UserBadge> UserBadges { get; set; }
        public ICollection<UserCodingGame> UserCodingGames { get; set; }
    }

    public enum UserRole
    {
        Student,
        Teacher,
        Admin
    }
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "ADMIN", "TEACHER", "STUDENT" };

            foreach (var role in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }

}
