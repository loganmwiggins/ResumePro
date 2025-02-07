using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.Models;
using ResumeProProject.Server.Data;
using Microsoft.AspNetCore.Identity;
using Azure.Core;


namespace ResumeProProject.Server.Controllers
{
    public class CreateResumeDto
    {
        // Resume Attributes
        public required string Id { get; set; } // User ID
        public required string ResumeName { get; set; }
        public required DateTime CurrentDate { get; set; }
        public required string TemplateId { get; set; }

        // One-to-One Relationship
        public required GeneralInformation GeneralInformation { get; set; }
        public Skills Skills { get; set; }

        // One-to-Many Relationships
        public List<Education> Educations { get; set; } = new();
        public List<Certification> Certifications { get; set; } = new();
        public List<Experience> Experiences { get; set; } = new();
        public List<Project> Projects { get; set; } = new();
    }


    [ApiController]
    [Route("/api/[controller]")]
    public class ResumeController(AppDbContext dbContext, UserManager<User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<User> _userManager;




        [HttpPost("Create")]
        public async Task<IActionResult> CreateResume([FromBody] CreateResumeDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var NewResume = new Resume
            {
                Name = request.ResumeName,
                UpdatedDateTime = request.CurrentDate,
                Id = request.Id,
                TemplateId = request.TemplateId
            };

            _db.Resumes.Add(NewResume);
            await _db.SaveChangesAsync();

            Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.UpdatedDateTime == request.CurrentDate && r.Id == request.Id);

            var NewGeneralInformation = new GeneralInformation
            {
                
                ResumeId = fetchedResume.ResumeId,
                
                FirstName = request.GeneralInformation.FirstName,
                MiddleName = request.GeneralInformation.MiddleName,
                LastName = request.GeneralInformation.LastName,
                Email = request.GeneralInformation.Email,
                PhoneNumber = request.GeneralInformation.PhoneNumber,
                WebsiteUrl = request.GeneralInformation.WebsiteUrl,
                LinkedInUrl = request.GeneralInformation.LinkedInUrl,
                GitHubUrl = request.GeneralInformation.GitHubUrl,
                //Resume = fetchedResume,

            };
            if (NewGeneralInformation != null) { _db.GeneralInformation.Add(NewGeneralInformation); await _db.SaveChangesAsync(); }

            for (int i = 0; i < request.Educations.Count; i++)
            {
                var NewEducation = new Education
                {
                    ResumeId = fetchedResume.ResumeId,
                    SchoolName = request.Educations[i].SchoolName,
                    DegreeType = request.Educations[i].DegreeType,
                    GPA = request.Educations[i].GPA,
                    Major = request.Educations[i].Major,
                    Minor = request.Educations[i].Minor,
                    StartDate = request.Educations[i].StartDate,
                    EndDate = request.Educations[i].EndDate,
                    //Resume = fetchedResume,
                };
                if (NewEducation != null) { _db.Education.Add(NewEducation); }
                await _db.SaveChangesAsync();
            }
            for (int i = 0; i < request.Certifications.Count; i++)
            {
                var NewCertification = new Certification
                {
                    ResumeId = fetchedResume.ResumeId,
                    Name = request.Certifications[i].Name,
                    Issuer = request.Certifications[i].Issuer,
                    IssueDate = request.Certifications[i].IssueDate,
                    ExpireDate = request.Certifications[i].ExpireDate,
                    //Resume = fetchedResume,

                };
                if (NewCertification != null) { _db.Certifications.Add(NewCertification); }
                await _db.SaveChangesAsync();
            }
            for (int i = 0; i < request.Experiences.Count; i++)
            {
                var NewExperience = new Experience
                {
                    ResumeId = fetchedResume.ResumeId,
                    CompanyName = request.Experiences[i].CompanyName,
                    Role = request.Experiences[i].Role,
                    StartDate = request.Experiences[i].StartDate,
                    EndDate = request.Experiences[i].EndDate,
                    IsCurrent = request.Experiences[i].EndDate == null ? true : false,
                    Description = request.Experiences[i].Description,
                    Location = request.Experiences[i].Location,
                    OfficeType = request.Experiences[i].OfficeType,
                    JobType = request.Experiences[i].JobType,
                    //Resume = fetchedResume,
                };

                if (NewExperience != null) { _db.Experiences.Add(NewExperience); }
                await _db.SaveChangesAsync();
            }
            var NewSkill = new Skills
            {
                ResumeId = fetchedResume.ResumeId,
                SkillsDataJson = request.Skills.SkillsDataJson,
                //Resume = fetchedResume,
            };
            if (NewSkill != null)
            {
                _db.Skills.Add(NewSkill);
                await _db.SaveChangesAsync();
            }
            for (int i = 0; i < request.Projects.Count; i++)
            {
                var NewProject = new Project
                {
                    ResumeId = fetchedResume.ResumeId,
                    Description = request.Projects[i].Description,
                    StartDate = request.Projects[i].StartDate,
                    EndDate = request.Projects[i].EndDate,
                    Title = request.Projects[i].Title
                };
                if (NewProject != null) { _db.Projects.Add(NewProject); }
                await _db.SaveChangesAsync();
            }

            return Ok(new { message = "Resume created successfully." });
        }

        [HttpGet("GetResumes/{userId}")]
        public async Task<IActionResult> GetResumes(string userId)
        {
            var resumes = await _db.Resumes
                .Where(r => r.Id == userId)
                .Include(r => r.GeneralInformation)
                .Include(r => r.Educations)
                .Include(r => r.Certifications)
                .Include(r => r.Experiences)
                .Include(r => r.Projects)
                .Include(r => r.Skills)
                .ToListAsync();

            if (!resumes.Any())
            {
                return Ok(new List<object>());
            }

            // Fetch all GeneralInformation separately
            var resumeIds = resumes.Select(r => r.ResumeId).ToList();
            var generalInfoDict = await _db.GeneralInformation
                .Where(g => resumeIds.Contains(g.ResumeId))
                .ToDictionaryAsync(g => g.ResumeId);

            var result = resumes.Select(resume => new
            {
                ResumeId = resume.ResumeId,
                ResumeName = resume.Name,
                UpdatedDateTime = resume.UpdatedDateTime,
                TemplateId = resume.TemplateId,

                GeneralInformation = generalInfoDict.TryGetValue(resume.ResumeId, out var genInfo) ? genInfo : null,

                Educations = resume.Educations.Select(e => new
                {
                    e.SchoolName,
                    e.DegreeType,
                    e.GPA,
                    e.Major,
                    e.Minor,
                    e.StartDate,
                    e.EndDate
                }).ToList(),

                Certifications = resume.Certifications.Select(c => new
                {
                    c.Name,
                    c.Issuer,
                    c.IssueDate,
                    c.ExpireDate
                }).ToList(),

                Experiences = resume.Experiences.Select(ex => new
                {
                    ex.CompanyName,
                    ex.Role,
                    ex.StartDate,
                    ex.EndDate,
                    ex.IsCurrent,
                    ex.Description,
                    ex.Location,
                    ex.OfficeType,
                    ex.JobType
                }).ToList(),

                Projects = resume.Projects.Select(p => new
                {
                    p.Title,
                    p.Description,
                    p.StartDate,
                    p.EndDate
                }).ToList(),

                Skills = resume.Skills != null ? new
                {
                    resume.Skills
                } : null
            }).ToList();

            return Ok(result);
        }

        [HttpDelete("DeleteResume/{resumeId}")]
        public async Task<IActionResult> DeleteResume(Guid resumeId)
        {
            var resume = await _db.Resumes.FindAsync(resumeId);

            if (resume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }

            _db.Resumes.Remove(resume);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Resume deleted successfully." });
        }


        [HttpGet("GetResumeById/{resumeId}")]
        public async Task<IActionResult> GetResume(Guid resumeId)
        {
            var resume = await _db.Resumes
                .Where(r => r.ResumeId == resumeId)
                .Include(r => r.GeneralInformation)
                .Include(r => r.Educations)
                .Include(r => r.Certifications)
                .Include(r => r.Experiences)
                .Include(r => r.Projects)
                .Include(r => r.Skills)
                .FirstOrDefaultAsync();

            if (resume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }

            var result = new
            {
                ResumeId = resume.ResumeId,
                ResumeName = resume.Name,
                UpdatedDateTime = resume.UpdatedDateTime,
                TemplateId = resume.TemplateId,

                GeneralInformation = await _db.GeneralInformation
           .Where(g => g.ResumeId == resumeId)
           .FirstOrDefaultAsync(),


                Educations = resume.Educations.Select(e => new
                {
                    e.SchoolName,
                    e.DegreeType,
                    e.GPA,
                    e.Major,
                    e.Minor,
                    e.StartDate,
                    e.EndDate
                }).ToList(),

                Certifications = resume.Certifications.Select(c => new
                {
                    c.Name,
                    c.Issuer,
                    c.IssueDate,
                    c.ExpireDate
                }).ToList(),

                Experiences = resume.Experiences.Select(ex => new
                {
                    ex.CompanyName,
                    ex.Role,
                    ex.StartDate,
                    ex.EndDate,
                    ex.IsCurrent,
                    ex.Description,
                    ex.Location,
                    ex.OfficeType,
                    ex.JobType
                }).ToList(),

                Projects = resume.Projects.Select(p => new
                {
                    p.Title,
                    p.Description,
                    p.StartDate,
                    p.EndDate
                }).ToList(),

                Skills = resume.Skills != null ? new
                {
                    resume.Skills
                } : null
            };

            return Ok(result);
        }

    }
}