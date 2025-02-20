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

        public required string SchoolName { get; set; }

        public string? SchoolLocation { get; set; }

        public required string DegreeType { get; set; }

        public double? GPA { get; set; }

        public required string Major { get; set; }

        public string? Minor { get; set; }

        public required DateOnly StartDate { get; set; }

        public required DateOnly EndDate { get; set; }

        public int OrderNumber { get; set; }
    }
}