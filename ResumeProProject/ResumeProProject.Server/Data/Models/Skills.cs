using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Skills
    {
        [Key]
        public Guid SkillsId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string SkillsJson { get; set; }
    }
}