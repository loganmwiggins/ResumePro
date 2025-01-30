using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ResumeProProject.Server.Data.Models
{
    // An "Experience" can encompass work experience, internships, volunteer work, etc.

    public class Experience
    {
        [Key]
        public Guid ExperienceId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string CompanyName { get; set; }

        public required string Role { get; set; }

        public required DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public required bool IsCurrent { get; set; }

        public required string Description { get; set; }

        public string? Location { get; set; }

        public OfficeType OfficeType { get; set; }

        public JobType JobType { get; set; }

        // ✅ Added Navigation Property
        public virtual Resume Resume { get; set; }
    }

    public enum OfficeType
    {
        [Description("On-site")]
        OnSite,

        [Description("Remote")]
        Remote,

        [Description("Hybrid")]
        Hybrid
    }
    
    public enum JobType
    {
        [Description("Full-time")]
        FullTime,

        [Description("Part-time")]
        PartTime,

        [Description("Volunteer")]
        Volunteer,

        [Description("Internship")]
        Internship,
    }
}