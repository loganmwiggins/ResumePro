using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Template
    {
        [JsonIgnore]
        [Key]
        public Guid TemplateId { get; set; }
        
        public required string Name { get; set; }

        public required string Content { get; set; }
    }
}