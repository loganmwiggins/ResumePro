using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using static ResumeProProject.Server.Data.DTOs.CommentDTOs;

namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommentController(AppDbContext dbContext, UserManager<User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<User> _userManager;

        // Create Comment
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] AddCommentDTO commentDTO)
        {
            Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.ResumeId == commentDTO.ResumeId);

            var newComment = new Comment
            {
                ResumeId = fetchedResume.ResumeId,
                UserId = commentDTO.UserId,
                CommentBody = commentDTO.CommentBody
            };

            if (newComment != null)
            {
                _db.Comments.Add(newComment);
                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Comment added successfully." });
        }
    }
}