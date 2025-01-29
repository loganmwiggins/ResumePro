using System.ComponentModel.DataAnnotations;

namespace ResumeProProject.Server.Data.Models
{
    public class Template
    {
        [Key]
        public Guid TemplateId { get; set; }

        public required string Name { get; set; }

        public required string Content { get; set; }
    }
}