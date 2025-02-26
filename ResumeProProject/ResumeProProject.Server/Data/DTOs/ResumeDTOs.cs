using ResumeProProject.Server.Data.Models;

namespace ResumeProProject.Server.Data.DTOs
{
    public class ResumeDTOs
    {
        public class CreateResumeDto
        {
            // Resume Attributes
            public required string Id { get; set; } // User ID
            public required string ResumeName { get; set; }
            public required DateTime CurrentDate { get; set; }
            public required string TemplateId { get; set; }
            public string Thumbnail { get; set; } // Base64-encoded image

            // One-to-One Relationship
            public required GeneralInformation GeneralInformation { get; set; }
            public Skills Skills { get; set; }

            // One-to-Many Relationships
            public List<Education> Educations { get; set; } = new();
            public List<Certification> Certifications { get; set; } = new();
            public List<Experience> Experiences { get; set; } = new();
            public List<Project> Projects { get; set; } = new();
        }

        public class UpdateResumeDto
        {
            public required Guid resumeId { get; set; }
            public required string ResumeName { get; set; }
            public required DateTime updatedDateTime { get; set; }
            public required string templateId { get; set; }
            public string thumbnail { get; set; } // Base64-encoded image

            public required GeneralInformation GeneralInformation { get; set; }
            public Skills Skills { get; set; }
            public List<Education> Educations { get; set; } = new();
            public List<Certification> Certifications { get; set; } = new();
            public List<Experience> Experiences { get; set; } = new();
            public List<Project> Projects { get; set; } = new();

        }

        public class DuplicateResumeDto
        {
            public required Guid resumeId { get; set; }
            public required DateTime CurrentDate { get; set; }
        }

        public class RenameResumeDto
        {
            public required Guid resumeId { get; set; }
            public required DateTime newTime { get; set; }
            public required string newName { get; set; }
        }
    }
}
