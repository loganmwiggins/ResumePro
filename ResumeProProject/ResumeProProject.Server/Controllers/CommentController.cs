using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;

namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommentController(AppDbContext dbContext, UserManager<User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<User> _userManager;
    }
}