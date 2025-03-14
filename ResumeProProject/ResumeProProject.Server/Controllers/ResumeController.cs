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
            if (NewGeneralInformation != null) { _db.GeneralInformation.Add(NewGeneralInformation); }

            var newEducations = request.Educations.Select(e => new Education
            {
                ResumeId = fetchedResume.ResumeId,
                SchoolName = e.SchoolName,
                DegreeType = e.DegreeType,
                GPA = e.GPA,
                Major = e.Major,
                Minor = e.Minor,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                SchoolLocation = e.SchoolLocation,
                OrderNumber = e.OrderNumber
                //Resume = fetchedResume,
            }).ToList();
            _db.Education.AddRange(newEducations);

            var newCertifications = request.Certifications.Select(c => new Certification
            {
                ResumeId = fetchedResume.ResumeId,
                Name = c.Name,
                Issuer = c.Issuer,
                IssueDate = c.IssueDate,
                ExpireDate = c.ExpireDate,
                OrderNumber = c.OrderNumber
            }).ToList();
            _db.Certifications.AddRange(newCertifications);

            var newExperiences = request.Experiences.Select(exp => new Experience
            {
                ResumeId = fetchedResume.ResumeId,
                CompanyName = exp.CompanyName,
                Role = exp.Role,
                StartDate = exp.StartDate,
                EndDate = exp.EndDate,
                IsCurrent = exp.EndDate == null,
                Description = exp.Description,
                Location = exp.Location,
                OfficeType = exp.OfficeType,
                JobType = exp.JobType,
                OrderNumber = exp.OrderNumber
            }).ToList();
            _db.Experiences.AddRange(newExperiences);

            var newSkill = new Skills
            {
                ResumeId = fetchedResume.ResumeId,
                SkillsDataJson = request.Skills.SkillsDataJson
            };
            _db.Skills.Add(newSkill);

            var newProjects = request.Projects.Select(p => new Project
            {
                ResumeId = fetchedResume.ResumeId,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Title = p.Title,
                OrderNumber = p.OrderNumber
            }).ToList();
            _db.Projects.AddRange(newProjects);

            await _db.SaveChangesAsync();

            return Ok(new { message = "Resume created successfully.", resumeId = fetchedResume.ResumeId });
        }

        [HttpGet("GetResumes/{userId}")]
        public async Task<IActionResult> GetResumes(string userId)
        {
            var result = await _db.Resumes
                .Where(r => r.Id == userId)
                .OrderByDescending(r => r.UpdatedDateTime)
                .Select(resume => new
                {
                    ResumeId = resume.ResumeId,
                    ResumeName = resume.Name,
                    UpdatedDateTime = resume.UpdatedDateTime,
                    TemplateId = resume.TemplateId,
                    ColorJson = resume.ColorJson,
                    TextSize = resume.TextSize,
                    Thumbnail = resume.Thumbnail
                })
                .ToListAsync(); // Fetch only needed columns

            if (!result.Any())
            {
                return Ok(new List<object>());
            }

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
                .Select(r => new
                {
                    ResumeId = r.ResumeId,
                    ResumeName = r.Name,
                    UpdatedDateTime = r.UpdatedDateTime,
                    TemplateId = r.TemplateId,
                    ColorJson = r.ColorJson,
                    TextSize = r.TextSize,
                    Thumbnail = r.Thumbnail,

                    GeneralInformation = r.GeneralInformation != null ? new
                    {
                        r.GeneralInformation.FirstName,
                        r.GeneralInformation.MiddleName,
                        r.GeneralInformation.LastName,
                        r.GeneralInformation.Email,
                        r.GeneralInformation.PhoneNumber,
                        r.GeneralInformation.WebsiteUrl,
                        r.GeneralInformation.LinkedInUrl,
                        r.GeneralInformation.GitHubUrl,
                        r.GeneralInformation.Location,
                        r.GeneralInformation.Role
                    } : null,

                    Educations = r.Educations
                        .OrderBy(e => e.OrderNumber)
                        .Select(e => new
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

                    Certifications = r.Certifications
                        .OrderBy(c => c.OrderNumber)
                        .Select(c => new
                        {
                            c.Name,
                            c.Issuer,
                            c.IssueDate,
                            c.ExpireDate,
                            c.OrderNumber
                        }).ToList(),

                    Experiences = r.Experiences
                        .OrderBy(ex => ex.OrderNumber)
                        .Select(ex => new
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

                    Projects = r.Projects
                        .OrderBy(p => p.OrderNumber)
                        .Select(p => new
                        {
                            p.Title,
                            p.Description,
                            p.StartDate,
                            p.EndDate,
                            p.OrderNumber
                        }).ToList(),

                    Skills = r.Skills != null ? new
                    {
                        r.Skills.SkillsDataJson
                    } : null
                })
                .FirstOrDefaultAsync();

            if (resume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }
            return Ok(resume);
        }

        [HttpPut("Update/{resumeId}")]
        public async Task<IActionResult> UpdateResume([FromBody] ResumeProProject.Server.Data.DTOs.ResumeDTOs.UpdateResumeDto request)
        {
            var existingResume = await _db.Resumes
                .Where(r => r.ResumeId == request.resumeId)
                .Include(r => r.GeneralInformation)
                .Include(r => r.Skills)
                .FirstOrDefaultAsync();

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

            // Remove old ones in a single call
            var resumeId = request.resumeId;
            _db.Education.RemoveRange(_db.Education.Where(e => e.ResumeId == resumeId));
            _db.Certifications.RemoveRange(_db.Certifications.Where(c => c.ResumeId == resumeId));
            _db.Experiences.RemoveRange(_db.Experiences.Where(e => e.ResumeId == resumeId));
            _db.Projects.RemoveRange(_db.Projects.Where(p => p.ResumeId == resumeId));

            // Batch Insert 
            _db.Education.AddRange(request.Educations.Select(e => new Education
            {
                ResumeId = resumeId,
                SchoolName = e.SchoolName,
                DegreeType = e.DegreeType,
                GPA = e.GPA,
                Major = e.Major,
                Minor = e.Minor,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                SchoolLocation = e.SchoolLocation,
                OrderNumber = e.OrderNumber
            }));

            _db.Certifications.AddRange(request.Certifications.Select(c => new Certification
            {
                ResumeId = resumeId,
                Issuer = c.Issuer,
                IssueDate = c.IssueDate,
                ExpireDate = c.ExpireDate,
                Name = c.Name,
                OrderNumber = c.OrderNumber
            }));

            _db.Experiences.AddRange(request.Experiences.Select(e => new Experience
            {
                ResumeId = resumeId,
                CompanyName = e.CompanyName,
                OfficeType = e.OfficeType,
                JobType = e.JobType,
                Description = e.Description,
                Role = e.Role,
                Location = e.Location,
                IsCurrent = e.IsCurrent,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                OrderNumber = e.OrderNumber
            }));

            _db.Projects.AddRange(request.Projects.Select(p => new Project
            {
                ResumeId = resumeId,
                Title = p.Title,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                OrderNumber = p.OrderNumber
            }));

            // Save all in a single call
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
                .Where(r => r.ResumeId == request.resumeId)
                .Include(r => r.GeneralInformation)
                .Include(r => r.Skills)
                .Include(r => r.Educations)
                .Include(r => r.Certifications)
                .Include(r => r.Experiences)
                .Include(r => r.Projects)
                .FirstOrDefaultAsync();

            if (existingResume == null)
            {
                return NotFound(new { message = "Resume not found." });
            }

            var newResume = new Resume
            {
                Name = existingResume.Name + " - Copy",
                UpdatedDateTime = request.CurrentDate,
                Id = existingResume.Id,
                TemplateId = existingResume.TemplateId,
                ColorJson = existingResume.ColorJson,
                TextSize = existingResume.TextSize,
                Thumbnail = existingResume.Thumbnail
            };

            _db.Resumes.Add(newResume);
            await _db.SaveChangesAsync();

            //Resume fetchedResume = await _db.Resumes.FirstOrDefaultAsync(r => r.UpdatedDateTime == request.CurrentDate && r.Id == existingResume.Id);

            var NewGeneralInformation = new GeneralInformation
            {

                ResumeId = newResume.ResumeId,
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
            if (NewGeneralInformation != null) { _db.GeneralInformation.Add(NewGeneralInformation); }

            var newEducations = existingResume.Educations.Select(e => new Education
            {
                ResumeId = newResume.ResumeId,
                SchoolName = e.SchoolName,
                DegreeType = e.DegreeType,
                GPA = e.GPA,
                Major = e.Major,
                Minor = e.Minor,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                SchoolLocation = e.SchoolLocation,
                OrderNumber = e.OrderNumber
            }).ToList();
            _db.Education.AddRange(newEducations);

            var newCertifications = existingResume.Certifications.Select(c => new Certification
            {
                ResumeId = newResume.ResumeId,
                Name = c.Name,
                Issuer = c.Issuer,
                IssueDate = c.IssueDate,
                ExpireDate = c.ExpireDate,
                OrderNumber = c.OrderNumber
            }).ToList();
            _db.Certifications.AddRange(newCertifications);

            var newExperiences = existingResume.Experiences.Select(exp => new Experience
            {
                ResumeId = newResume.ResumeId,
                CompanyName = exp.CompanyName,
                Role = exp.Role,
                StartDate = exp.StartDate,
                EndDate = exp.EndDate,
                IsCurrent = exp.EndDate == null,
                Description = exp.Description,
                Location = exp.Location,
                OfficeType = exp.OfficeType,
                JobType = exp.JobType,
                OrderNumber = exp.OrderNumber
            }).ToList();
            _db.Experiences.AddRange(newExperiences);

            var newSkill = new Skills
            {
                ResumeId = newResume.ResumeId,
                SkillsDataJson = existingResume.Skills?.SkillsDataJson
            };
            if (newSkill != null)
            {
                _db.Skills.Add(newSkill);
            }
            var newProjects = existingResume.Projects.Select(p => new Project
            {
                ResumeId = newResume.ResumeId,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Title = p.Title,
                OrderNumber = p.OrderNumber
            }).ToList();
            _db.Projects.AddRange(newProjects);

            await _db.SaveChangesAsync();
            return Ok(new { message = "Resume duplicated successfully.", resumeId = newResume.ResumeId });
        }
    }
}