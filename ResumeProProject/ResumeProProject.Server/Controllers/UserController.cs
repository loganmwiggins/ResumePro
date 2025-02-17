using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using ResumeProProject.Server.Data.Models;
using System;
using System.Threading.Tasks;

namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Extends Register Method
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomRegisterRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                DateJoined = DateTime.UtcNow,
                IsFirstLogin = true
                //CoreResumeId = model.CoreResumeId
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                message = "User registered successfully",
                userId = user.Id
            });
        }

        // Get All Users
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();

            if (!users.Any())
                return NotFound(new { message = "No users found." });

            var userList = users.Select(user => new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.DateJoined,
                user.IsFirstLogin,
                user.CoreResumeId
            });

            return Ok(userList);
        }

        // GET User by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.DateJoined,
                user.IsFirstLogin,
                user.CoreResumeId
            });
        }

        // Update User - Set CoreResumeId
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (!string.IsNullOrEmpty(model.Email))
                user.Email = model.Email;
            if (!string.IsNullOrEmpty(model.PhoneNumber))
                user.PhoneNumber = model.PhoneNumber;
            if (!string.IsNullOrEmpty(model.FirstName))
                user.FirstName = model.FirstName;
            if (!string.IsNullOrEmpty(model.LastName))
                user.LastName = model.LastName;
            if (model.CoreResumeId.HasValue)
                user.CoreResumeId = model.CoreResumeId.Value;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User updated successfully", userId = user.Id });
        }

        // DELETE User by ID
        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest(new { message = "Failed to delete user", errors = result.Errors });

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("info")]
        //[Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = _userManager.GetUserId(User);
            if (userId == null)
                return Unauthorized(new { message = "User not authenticated" });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.DateJoined,
                user.IsFirstLogin,
                user.CoreResumeId
            });
        }
    }

    // DTOs
    public class CustomRegisterRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsFirstLogin { get; set; } = true;
        public Guid? CoreResumeId { get; set; }
    }

    public class UpdateUserRequest
    {
        public required string UserId { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public Guid? CoreResumeId { get; set; }
    }
}