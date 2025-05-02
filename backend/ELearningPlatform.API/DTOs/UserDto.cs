using ELearningPlatform.API.Models;
using System;

namespace ELearningPlatform.API.DTOs
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfilePicture { get; set; }
        public string Bio { get; set; }
        public string Role { get; set; }
        public int Points { get; set; }
        public int Level { get; set; }
        public string Token { get; set; }
    }

    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; } // "Student", "Teacher", "Admin"
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public IFormFile? ProfilePicture { get; set; }
        public string? Bio { get; set; }
    }
}
