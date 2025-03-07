using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ResumeProProject.Server.Data.Models;
using ResumeProProject.Server.Data;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.DTOs;
namespace ResumeProProject.Server.Controllers
{
    
    [ApiController]
    [Route("/api/[controller]")]
    public class InsightController(AppDbContext dbContext, UserManager<User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<User> _userManager;

        // INSIGHTS CONTROLLER ACTIONS
        [HttpPost("AddInsight")]
        public async Task<IActionResult> AddInsight([FromBody] ResumeProProject.Server.Data.DTOs.InsightDTOs.addInsightDTO request)
        {
            Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.ResumeId == request.resumeId);

            var NewInsight = new Insight
            {
                ResumeId = fetchedResume.ResumeId,
                Content = request.content
            };

            if (NewInsight != null) {
                _db.Insights.Add(NewInsight);
                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Insight added successfully." });
        }

        [HttpGet("GetInsight/{resumeId}")]
        public async Task<IActionResult> GetInsight(Guid resumeId)
        {
            var insight = await _db.Insights
                .Where(i => i.ResumeId == resumeId)
                .Select(i => i.Content)
                .FirstOrDefaultAsync();

            if (insight == null)
            {
                return NotFound("No insights found for this resume.");
            }

            return Ok(insight);
        }


        [HttpDelete("DeleteInsight/{resumeId}")]

        public async Task<IActionResult> DeleteInsight(Guid resumeId)
        {
            var finsight = await _db.Insights
                .Where(i => i.ResumeId == resumeId)
                .FirstOrDefaultAsync();

            if (finsight == null)
            {
                return NotFound("No insights found for this resume.");
            }
            _db.Insights.Remove(finsight);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Insight deleted successfully." });
        }
    }
}