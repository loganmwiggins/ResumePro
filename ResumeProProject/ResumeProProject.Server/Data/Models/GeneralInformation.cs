using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class GeneralInformation
    {
        [JsonIgnore]
        [Key]
        public Guid GeneralInfoId { get; set; }
        [JsonIgnore]
        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        // ✅ Added Navigation Property
        [JsonIgnore]
        public virtual Resume? Resume { get; set; }

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
