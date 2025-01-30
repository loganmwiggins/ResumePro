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
    [ApiController]
    [Route("/api/[controller]")]
    public class TemplateController : Controller
    {
        private readonly AppDbContext _context;

        public TemplateController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Template
        [HttpGet]
        public async Task<IActionResult> GetAllTemplates()
        {
            var allTemplates = await _context.Templates.ToListAsync();

            return Ok(allTemplates);
        }

        // GET: api/Template/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTemplateById(Guid id)
        {
            var template = await _context.Templates.FirstOrDefaultAsync(t => t.TemplateId == id);

            if (template == null)
            {
                return NotFound(new { message = "Template not found." });
            }

            return Ok(template);
        }
    }
}