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
        public required Guid TemplateId { get; set; }

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
            var NewResume = new Resume
            {
                Name = request.ResumeName,
                UpdatedDateTime = request.CurrentDate,
                UpdatedDateTime = request.CurrentDate,
                Id = request.Id,
                TemplateId = request.TemplateId

            };

            _db.Resumes.Add(NewResume);
            await _db.SaveChangesAsync();


            Resume fetchedResume = await _db.Resumes
        .FirstOrDefaultAsync(r => r.UpdatedDateTime == request.CurrentDate);
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.

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
                    IsCurrent = request.Experiences[i].IsCurrent,
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
            for (int i = 0; i < request.Experiences.Count; i++)
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

            return Ok();
        }

    }
}