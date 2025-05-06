using System.Globalization;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using ELearningPlatform.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
                return BadRequest("Email is already taken");

            if (await _userManager.FindByNameAsync(registerDto.Username) != null)
                return BadRequest("Username is already taken");

            var user = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Role = Enum.Parse<UserRole>(registerDto.Role),
                Points = 0,
                Level = 1
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            // Add user to role
            var normalizedRole = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(registerDto.Role.ToLower());
            var roleResult = await _userManager.AddToRoleAsync(user, normalizedRole);
    
            if (!roleResult.Succeeded)
            {
                return BadRequest(roleResult.Errors);
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePicture = user.ProfilePicture,
                Bio = user.Bio,
                Role = user.Role.ToString(),
                Points = user.Points,
                Level = user.Level,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);

                if (user == null) return Unauthorized("Invalid email");

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

                if (!result.Succeeded) return Unauthorized("Invalid password");

                // Generate token
                var token = await _tokenService.CreateToken(user);
                if (string.IsNullOrEmpty(token))
                {
                    return StatusCode(500, "Failed to generate authentication token");
                }

                return new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ProfilePicture = user.ProfilePicture,
                    Bio = user.Bio,
                    Role = user.Role.ToString(),
                    Points = user.Points,
                    Level = user.Level,
                    Token = token
                };
            }
            catch (Exception ex)
            {
                // Log the exception here
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfilePicture = user.ProfilePicture,
                Bio = user.Bio,
                Role = user.Role.ToString(),
                Points = user.Points,
                Level = user.Level,
                Token = await _tokenService.CreateToken(user)
            };
        }

        [Authorize]
        [Authorize]
        [HttpPut]
        public async Task<ActionResult<UserDto>> UpdateUser([FromForm] UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(User.Identity.Name);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Handle file upload only if present and has content
                if (updateUserDto.ProfilePicture != null && updateUserDto.ProfilePicture.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "profile-pictures");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + updateUserDto.ProfilePicture.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await updateUserDto.ProfilePicture.CopyToAsync(fileStream);
                    }

                    if (!string.IsNullOrEmpty(user.ProfilePicture))
                    {
                        var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",
                            user.ProfilePicture.TrimStart('/'));
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }

                    user.ProfilePicture = $"/profile-pictures/{uniqueFileName}";
                }

                // Update other fields
                if (!string.IsNullOrEmpty(updateUserDto.FirstName))
                {
                    user.FirstName = updateUserDto.FirstName;
                }

                if (!string.IsNullOrEmpty(updateUserDto.LastName))
                {
                    user.LastName = updateUserDto.LastName;
                }

                if (!string.IsNullOrEmpty(updateUserDto.Bio))
                {
                    user.Bio = updateUserDto.Bio;
                }

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        message = "User update failed",
                        errors = result.Errors.Select(e => e.Description)
                    });
                }

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Username = user.UserName,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ProfilePicture = $"{Request.Scheme}://{Request.Host}{user.ProfilePicture}",
                    Bio = user.Bio,
                    Role = user.Role.ToString(),
                    Points = user.Points,
                    Level = user.Level,
                    Token = await _tokenService.CreateToken(user)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
