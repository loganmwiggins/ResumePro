using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ResumeProProject.Server.Controllers
{
    public class UserController : Controller
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _context.Users
                .Include(u => u.Resumes)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        // GET
        [HttpGet("current")]
        // [Authorize]
        public async Task<IActionResult> GetCurrentUser(Guid id)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);

            //if (string.IsNullOrEmpty(username)){
            //    return Unauthorized(new { message = "User not authenticated" });
            //}

            var user = await _context.Users
                .Include(u => u.Resumes)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);

        }

        // POST: Create User
        // [HttpPost("create")]

        //  Patch: Update User
        //[HttpPut("{id}")]
        //[Authorize]
        //public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
        //{
        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null)
        //        return NotFound(new { message = "User not found" });

        //    user.Username = request.Username ?? user.Username;
        //    //if (!string.IsNullOrEmpty(request.Password))
        //    //{
        //    //    user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
        //    //}

        //    _context.Users.Update(user);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "User updated successfully" });
        //}



        // Delete User
        [HttpDelete("{id}")]
        //[Authorize]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }






        //public IActionResult Index()
        //{
        //    return View();
        //}
    }
}
