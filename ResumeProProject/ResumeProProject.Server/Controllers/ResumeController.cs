using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.Models;
using ResumeProProject.Server.Data;
using Microsoft.AspNetCore.Identity;
using ResumeProProject.Server.Data.DTOs;
using Azure.Core;
using static ResumeProProject.Server.Data.DTOs.ResumeDTOs;


namespace ResumeProProject.Server.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ResumeController(AppDbContext dbContext, UserManager<User> userManager) : Controller
    {
        private readonly ILogger<ResumeController> _logger;
        private readonly AppDbContext _db = dbContext;
        private readonly UserManager<User> _userManager;


        [HttpPost("Create")]
        public async Task<IActionResult> CreateResume([FromBody] ResumeProProject.Server.Data.DTOs.ResumeDTOs.CreateResumeDto request)
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
                TemplateId = request.TemplateId,
                ColorJson = request.ColorJson,
                TextSize = request.TextSize,
                Thumbnail = request.Thumbnail // Store Thumbnail
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
                Location = request.GeneralInformation.Location,
                Role = request.GeneralInformation.Role
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
                    SchoolLocation = request.Educations[i].SchoolLocation,
                    OrderNumber = request.Educations[i].OrderNumber
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
                    OrderNumber = request.Certifications[i].OrderNumber
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
                    OrderNumber = request.Experiences[i].OrderNumber,
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
                    Title = request.Projects[i].Title,
                    OrderNumber = request.Projects[i].OrderNumber
                };
                if (NewProject != null) { _db.Projects.Add(NewProject); }
                await _db.SaveChangesAsync();
            }
            return Ok(new { message = "Resume created successfully.", resumeId = fetchedResume.ResumeId });
        }

        [HttpGet("GetResumes/{userId}")]
        public async Task<IActionResult> GetResumes(string userId)
        {
            var resumes = await _db.Resumes
                .Where(r => r.Id == userId)
                .OrderByDescending(r => r.UpdatedDateTime)
                .ToListAsync();

            if (!resumes.Any())
            {
                return Ok(new List<object>());
            }

            // Fetch all GeneralInformation separately
            var resumeIds = resumes.Select(r => r.ResumeId).ToList();

            var result = resumes.Select(resume => new
            {
                ResumeId = resume.ResumeId,
                ResumeName = resume.Name,
                UpdatedDateTime = resume.UpdatedDateTime,
                TemplateId = resume.TemplateId,
                ColorJson = resume.ColorJson,
                TextSize = resume.TextSize,
                Thumbnail = resume.Thumbnail,

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
                ColorJson = resume.ColorJson,
                TextSize = resume.TextSize,
                UserId = resume.Id,
                Thumbnail = resume.Thumbnail,
                
                GeneralInformation = await _db.GeneralInformation
           .Where(g => g.ResumeId == resumeId)
           .FirstOrDefaultAsync(),


                Educations = resume.Educations.OrderBy(e => e.OrderNumber).Select(e => new
                {
                    e.SchoolName,
                    e.DegreeType,
                    GPA = e.GPA.HasValue ? e.GPA.Value.ToString("0.0") : (string)null,
                    e.Major,
                    e.Minor,
                    e.StartDate,
                    e.EndDate,
                    e.SchoolLocation,
                    e.OrderNumber
                }).ToList(),

                Certifications = resume.Certifications.OrderBy(c => c.OrderNumber).Select(c => new
                {
                    c.Name,
                    c.Issuer,
                    c.IssueDate,
                    c.ExpireDate,
                    c.OrderNumber
                }).ToList(),

                Experiences = resume.Experiences.OrderBy(ex => ex.OrderNumber).Select(ex => new
                {
                    ex.CompanyName,
                    ex.Role,
                    ex.StartDate,
                    ex.EndDate,
                    ex.IsCurrent,
                    ex.Description,
                    ex.Location,
                    ex.OfficeType,
                    ex.JobType,
                    ex.OrderNumber
                }).ToList(),

                Projects = resume.Projects.OrderBy(p => p.OrderNumber).Select(p => new
                {
                    p.Title,
                    p.Description,
                    p.StartDate,
                    p.EndDate,
                    p.OrderNumber
                }
                ).ToList(),

                Skills = await _db.Skills
           .Where(g => g.ResumeId == resumeId)
           .FirstOrDefaultAsync(),
            };

            return Ok(result);
        }


        [HttpPut("Update/{resumeId}")]
        public async Task<IActionResult> UpdateResume([FromBody] ResumeProProject.Server.Data.DTOs.ResumeDTOs.UpdateResumeDto request)
        {
            var existingResume = await _db.Resumes
                .Include(r => r.GeneralInformation)
                .Include(r => r.Skills)
                .Include(r => r.Educations)
                .Include(r => r.Certifications)
                .Include(r => r.Experiences)
                .Include(r => r.Projects)
                .FirstOrDefaultAsync(r => r.ResumeId == request.resumeId);

            if (existingResume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }

            // Update Resume properties
            existingResume.Name = request.ResumeName;
            existingResume.UpdatedDateTime = request.updatedDateTime;
            existingResume.TemplateId = request.templateId;
            existingResume.ColorJson = request.colorJson;
            existingResume.TextSize = request.textSize;
            existingResume.Thumbnail = request.thumbnail;

            existingResume.TemplateId = request.templateId;
            // Update General Information
            if (existingResume.GeneralInformation != null)
            {
                existingResume.GeneralInformation.FirstName = request.GeneralInformation.FirstName;
                existingResume.GeneralInformation.MiddleName = request.GeneralInformation.MiddleName;
                existingResume.GeneralInformation.LastName = request.GeneralInformation.LastName;
                existingResume.GeneralInformation.Email = request.GeneralInformation.Email;
                existingResume.GeneralInformation.PhoneNumber = request.GeneralInformation.PhoneNumber;
                existingResume.GeneralInformation.WebsiteUrl = request.GeneralInformation.WebsiteUrl;
                existingResume.GeneralInformation.LinkedInUrl = request.GeneralInformation.LinkedInUrl;
                existingResume.GeneralInformation.GitHubUrl = request.GeneralInformation.GitHubUrl;
                existingResume.GeneralInformation.Role = request.GeneralInformation.Role;
                existingResume.GeneralInformation.Location = request.GeneralInformation.Location;
            }
            else
            {
                existingResume.GeneralInformation = request.GeneralInformation;
            }

            if (existingResume.Skills != null)
            {
                existingResume.Skills.SkillsDataJson = request.Skills.SkillsDataJson;
            }
            else
            {
                existingResume.Skills = request.Skills;
            }

            _db.Education.RemoveRange(existingResume.Educations);
            await _db.SaveChangesAsync();

            existingResume.Educations.Clear();
            foreach (var edu in request.Educations)
            {
                existingResume.Educations.Add(new Education
                {
                    ResumeId = request.resumeId,
                    SchoolName = edu.SchoolName,
                    DegreeType = edu.DegreeType,
                    GPA = edu.GPA,
                    Major = edu.Major,
                    Minor = edu.Minor,
                    StartDate = edu.StartDate,
                    EndDate = edu.EndDate,
                    SchoolLocation = edu.SchoolLocation,
                    OrderNumber = edu.OrderNumber,
                });
            }

            _db.Certifications.RemoveRange(existingResume.Certifications);
            await _db.SaveChangesAsync();
            existingResume.Certifications.Clear();
            foreach (var cert in request.Certifications)
            {
                existingResume.Certifications.Add(new Certification
                {
                    ResumeId = request.resumeId,
                    Issuer = cert.Issuer,
                    IssueDate = cert.IssueDate,
                    ExpireDate = cert.ExpireDate,
                    Name = cert.Name,
                    OrderNumber = cert.OrderNumber,
                });
            }

            _db.Experiences.RemoveRange(existingResume.Experiences);
            await _db.SaveChangesAsync();

            existingResume.Experiences.Clear();
            foreach (var exp in request.Experiences)
            {
                existingResume.Experiences.Add(new Experience
                {
                    ResumeId = request.resumeId,
                    CompanyName = exp.CompanyName,
                    OfficeType = exp.OfficeType,
                    JobType = exp.JobType,
                    Description = exp.Description,
                    Role = exp.Role,
                    Location = exp.Location,
                    IsCurrent = exp.IsCurrent,
                    StartDate = exp.StartDate,
                    EndDate = exp.EndDate,
                    OrderNumber = exp.OrderNumber
                });
            }


            _db.Projects.RemoveRange(existingResume.Projects);
            await _db.SaveChangesAsync();
            existingResume.Projects.Clear();
            foreach (var proj in request.Projects)
            {
                existingResume.Projects.Add(new Project
                {
                    ResumeId = request.resumeId,
                    Title = proj.Title,
                    Description = proj.Description,
                    StartDate = proj.StartDate,
                    EndDate = proj.EndDate,
                    OrderNumber = proj.OrderNumber
                });
            }


            await _db.SaveChangesAsync();
            return Ok(new { message = "Resume updated successfully.", resumeId = existingResume.ResumeId });
        }

        [HttpPut("Rename")]
        public async Task<IActionResult> RenameResume([FromBody] RenameResumeDto request)
        {
            var existingResume = await _db.Resumes

                .FirstOrDefaultAsync(r => r.ResumeId == request.resumeId);

            if (existingResume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }
            existingResume.Name = request.newName;
            existingResume.UpdatedDateTime = request.newTime; 


            await _db.SaveChangesAsync();
            return Ok(new { message = "Resume renamed successfully.", resumeId = existingResume.ResumeId });

        }
            [HttpPost("Duplicate")]
        public async Task<IActionResult> DuplicateResume([FromBody] ResumeProProject.Server.Data.DTOs.ResumeDTOs.DuplicateResumeDto request)
        {
            var existingResume = await _db.Resumes
                .Include(r => r.GeneralInformation)
                .Include(r => r.Skills)
                .Include(r => r.Educations)
                .Include(r => r.Certifications)
                .Include(r => r.Experiences)
                .Include(r => r.Projects)
                .FirstOrDefaultAsync(r => r.ResumeId == request.resumeId);

            if (existingResume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }



            var NewResume = new Resume
            {
                Name = existingResume.Name + " - Copy",
                UpdatedDateTime = request.CurrentDate,
                Id = existingResume.Id,
                TemplateId = existingResume.TemplateId,
                ColorJson = existingResume.ColorJson,
                TextSize = existingResume.TextSize,
                Thumbnail = existingResume.Thumbnail // Store Thumbnail
            };

            _db.Resumes.Add(NewResume);
            await _db.SaveChangesAsync();

            Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.UpdatedDateTime == request.CurrentDate && r.Id == existingResume.Id);
            var NewGeneralInformation = new GeneralInformation
            {

                ResumeId = fetchedResume.ResumeId,

                FirstName = existingResume.GeneralInformation.FirstName,
                MiddleName = existingResume.GeneralInformation.MiddleName,
                LastName = existingResume.GeneralInformation.LastName,
                Email = existingResume.GeneralInformation.Email,
                PhoneNumber = existingResume.GeneralInformation.PhoneNumber,
                WebsiteUrl = existingResume.GeneralInformation.WebsiteUrl,
                LinkedInUrl = existingResume.GeneralInformation.LinkedInUrl,
                GitHubUrl = existingResume.GeneralInformation.GitHubUrl,
                Location = existingResume.GeneralInformation.Location,
                Role = existingResume.GeneralInformation.Role
                //Resume = fetchedResume,

            };
            if (NewGeneralInformation != null) { _db.GeneralInformation.Add(NewGeneralInformation); await _db.SaveChangesAsync(); }

            foreach (var education in existingResume.Educations)
            {
                var NewEducation = new Education
                {
                    ResumeId = fetchedResume.ResumeId,
                    SchoolName = education.SchoolName,
                    DegreeType = education.DegreeType,
                    GPA = education.GPA,
                    Major = education.Major,
                    Minor = education.Minor,
                    StartDate = education.StartDate,
                    EndDate = education.EndDate,
                    SchoolLocation = education.SchoolLocation,
                    OrderNumber = education.OrderNumber,
                    //Resume = fetchedResume,
                };
                if (NewEducation != null) { _db.Education.Add(NewEducation); }
                await _db.SaveChangesAsync();
            }
            foreach (var certification in existingResume.Certifications)
            {
                var NewCertification = new Certification
                {
                    ResumeId = fetchedResume.ResumeId,
                    Name = certification.Name,
                    Issuer = certification.Issuer,
                    IssueDate = certification.IssueDate,
                    ExpireDate = certification.ExpireDate,
                    OrderNumber = certification.OrderNumber,
                    //Resume = fetchedResume,

                };
                if (NewCertification != null) { _db.Certifications.Add(NewCertification); }
                await _db.SaveChangesAsync();
            }
            foreach (var experience in existingResume.Experiences)
            {
                var NewExperience = new Experience
                {
                    ResumeId = fetchedResume.ResumeId,
                    CompanyName = experience.CompanyName,
                    Role = experience.Role,
                    StartDate = experience.StartDate,
                    EndDate = experience.EndDate,
                    IsCurrent = experience.EndDate == null ? true : false,
                    Description = experience.Description,
                    Location = experience.Location,
                    OfficeType = experience.OfficeType,
                    JobType = experience.JobType,
                    OrderNumber = experience.OrderNumber,
                    //Resume = fetchedResume,
                };

                if (NewExperience != null) { _db.Experiences.Add(NewExperience); }
                await _db.SaveChangesAsync();
            }
            var NewSkill = new Skills
            {
                ResumeId = fetchedResume.ResumeId,
                SkillsDataJson = existingResume.Skills.SkillsDataJson,
                //Resume = fetchedResume,
            };
            if (NewSkill != null)
            {
                _db.Skills.Add(NewSkill);
                await _db.SaveChangesAsync();
            }
            foreach (var project in existingResume.Projects)
            {
                var NewProject = new Project
                {
                    ResumeId = fetchedResume.ResumeId,
                    Description = project.Description,
                    StartDate = project.StartDate,
                    EndDate = project.EndDate,
                    Title = project.Title,
                    OrderNumber = project.OrderNumber,
                };
                if (NewProject != null) { _db.Projects.Add(NewProject); }
                await _db.SaveChangesAsync();
            }
            return Ok(new { message = "Resume duplicated successfully.", resumeId = fetchedResume.ResumeId });
        }
    }
}