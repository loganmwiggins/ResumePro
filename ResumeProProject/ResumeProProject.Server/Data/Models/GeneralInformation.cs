using System;
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

        // ✅ Added Navigation Property
        public virtual Resume Resume { get; set; }

        // ✅ Ensure Required Fields Have Validation
        [Required]
        public string FirstName { get; set; }

        public string? MiddleName { get; set; } // Optional field

        [Required]
        public string LastName { get; set; }

        [EmailAddress] // ✅ Email validation
        public string? Email { get; set; }

        [Phone] // ✅ Phone validation
        public string? PhoneNumber { get; set; }

        [Url] // ✅ URL validation
        public string? WebsiteUrl { get; set; }

        [Url]
        public string? LinkedInUrl { get; set; }

        [Url]
        public string? GitHubUrl { get; set; }
    }
}
