using Azure.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using static ResumeProProject.Server.Data.DTOs.CommentDTOs;

namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommentController(AppDbContext dbContext, UserManager<Data.Models.User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<Data.Models.User> _userManager;

        // Get all comments
        [HttpGet("{resumeId}")]
        public async Task<IActionResult> GetCommentsByResume(Guid resumeId)
        {
            var comments = await _db.Comments
                .Where(c => c.ResumeId == resumeId)
                .OrderByDescending(r => r.DateTimeSubmitted)
                .ToListAsync();

            if (!comments.Any())
            {
                return Ok(new List<object>());
            }

            return Ok(comments);
        }

        // Create Comment
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] AddCommentDTO commentDTO)
        {
            Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.ResumeId == commentDTO.ResumeId);

            var newComment = new Comment
            {
                ResumeId = fetchedResume.ResumeId,
                UserId = commentDTO.UserId,
                FullName = commentDTO.FullName,
                UserImage = commentDTO.UserImage,
                CommentBody = commentDTO.CommentBody,
                DateTimeSubmitted = DateTime.UtcNow
            };

            if (newComment != null)
            {
                _db.Comments.Add(newComment);
                await _db.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Comment added successfully.",
                comment = newComment
            });
        }

        // Delete Comment
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteInsight(Guid commentId)
        {
            var comment = await _db.Comments
                .Where(c => c.CommentId == commentId)
                .FirstOrDefaultAsync();

            if (comment == null) return NotFound("Comment does not exist.");

            _db.Comments.Remove(comment);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Comment deleted successfully." });
        }
    }
}