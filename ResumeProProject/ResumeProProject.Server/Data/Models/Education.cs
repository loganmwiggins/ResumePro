using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Education
    {
        [Key]
        public Guid EducationId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string SchoolName { get; set; }

        public Degree DegreeType { get; set; } // Enum Property

        public double? GPA { get; set; }

        public required string Major { get; set; }

        public string? Minor { get; set; }

        public required DateOnly StartDate {  get; set; }

        public DateOnly? EndDate { get; set; }

    }

    public enum Degree
    {
        Undergraduate,
        Graduate,
        Doctorate
    }
}