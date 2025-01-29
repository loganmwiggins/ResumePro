using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Resume
    {
        [Key]
        public Guid ResumeId { get; set; }

        [ForeignKey("Template")]
        public Guid TemplateId { get; set; }

        public required string Name { get; set; } = "Untitled Resume";

        public required DateTime UpdatedDateTime { get; set; }

    }
}