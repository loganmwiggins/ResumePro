using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.Models;
using ResumeProProject.Server.Data;


namespace ResumeProProject.Server.Controllers
{
    public class CreateResumeDto
    {
        //RESUME ATTRIBUTES
        public required string  Id { get; set; }
        public required string ResumeName { get; set; }
        public required DateTime currentDate { get; set; }
        public required Guid TemplateId { get; set; }


        public required GeneralInformation GeneralInformation { get; set; }
        public Education? Education { get; set; }
        public Certification? Certification { get; set; }
        public Experience? Experience { get; set; }
        public Skills? Skills { get; set; }
        public Project? Project { get; set; }

    }

    [ApiController]
    [Route("/api/[controller]")]
    public class ResumeController(AppDbContext dbContext) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;



        [HttpPost("Create")]
        public async Task<IActionResult> CreateResume([FromBody] CreateResumeDto request)
        {
            var NewResume = new Resume
            {
                Name = request.ResumeName,
                UpdatedDateTime = request.currentDate,
                Id = request.Id,
                TemplateId = request.TemplateId

            };

            _db.Resumes.Add(NewResume);
            await _db.SaveChangesAsync();


#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
            Resume fetchedResume = await _db.Resumes
        .FirstOrDefaultAsync(r => r.UpdatedDateTime == request.currentDate);
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


            var NewEducation = new Education
            {
                ResumeId = fetchedResume.ResumeId,
                SchoolName = request.Education.SchoolName,
                DegreeType = request.Education.DegreeType,
                GPA = request.Education.GPA,
                Major = request.Education.Major,
                Minor = request.Education.Minor,
                StartDate = request.Education.StartDate,
                EndDate = request.Education.EndDate,
                //Resume = fetchedResume,
            };
            if (NewEducation != null) { _db.Education.Add(NewEducation); }
            await _db.SaveChangesAsync();

            var NewCertification = new Certification
            {
                ResumeId = fetchedResume.ResumeId,
                Name = request.Certification.Name,
                Issuer = request.Certification.Issuer,
                IssueDate = request.Certification.IssueDate,
                ExpireDate = request.Certification.ExpireDate,
                //Resume = fetchedResume,

            };
            if (NewCertification != null) { _db.Certifications.Add(NewCertification); }
            await _db.SaveChangesAsync();

            var NewExperience = new Experience
            {
                ResumeId = fetchedResume.ResumeId,
                CompanyName = request.Experience.CompanyName,
                Role = request.Experience.Role,
                StartDate = request.Experience.StartDate,
                EndDate = request.Experience.EndDate,
                IsCurrent = request.Experience.IsCurrent,
                Description = request.Experience.Description,
                Location = request.Experience.Location,
                OfficeType = request.Experience.OfficeType,
                JobType = request.Experience.JobType,
                //Resume = fetchedResume,
            };
            if (NewExperience != null) { _db.Experiences.Add(NewExperience); }
            await _db.SaveChangesAsync();

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

            var NewProject = new Project
            {
                ResumeId = fetchedResume.ResumeId,
                Description = request.Project.Description,
            };
            if (NewProject != null) { _db.Projects.Add(NewProject); }
            await _db.SaveChangesAsync();

            return Ok();
        }

    }
}
