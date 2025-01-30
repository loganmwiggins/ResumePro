using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : Controller
    {
        private readonly AppDbContext _context;
        //private readonly UserManager<User> _userManager;
        //private readonly SignInManager<User> _signInManager;

        //public UserController(UserManager<User> userManager, SignInManager<User> signInManager, AppDbContext context)
        //{
        //    _userManager = userManager;
        //    _signInManager = signInManager;
        //    _context = context;
        //}
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/user - Get All Users -- WE DO NOT HAVE THIS ON THE PLANNER, ITS FOR TESTING LOL
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Resumes) // Include related resumes
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            // var user = await _context.Users
            var user = await _context.Users
                .Include(u => u.Resumes)
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }




    }
}