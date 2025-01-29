using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class GeneralInformation
    {
        [Key]
        public Guid GeneralInfoId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string FirstName { get; set; }

        public string? MiddleName { get; set; }

        public required string LastName { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? LinkedInUrl { get; set; }

        public string? GitHubUrl { get; set; }
    }
}