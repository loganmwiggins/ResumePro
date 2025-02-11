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

        public required string FirstName { get; set; }

        public string? MiddleName { get; set; }

        public required string LastName { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Role { get; set; }

        public string? Location { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? LinkedInUrl { get; set; }

        public string? GitHubUrl { get; set; }
    }
}