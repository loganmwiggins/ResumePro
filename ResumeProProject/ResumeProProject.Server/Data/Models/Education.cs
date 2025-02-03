using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Education
    {
        [JsonIgnore]
        [Key]
        public Guid EducationId { get; set; }
        [JsonIgnore]
        // ✅ Explicit Foreign Key for Resume
        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        //// ✅ Navigation Property
        [JsonIgnore]
        public virtual Resume? Resume { get; set; }

        [Required]
        public string SchoolName { get; set; }

        // ✅ Store Enum as String
        [Required]
        public DegreeLevel DegreeType { get; set; }

        public double? GPA { get; set; }

        [Required]
        public string Major { get; set; }

        public string? Minor { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }

    public enum DegreeLevel
    {
        Undergraduate,
        Graduate,
        Doctorate
    }
}
