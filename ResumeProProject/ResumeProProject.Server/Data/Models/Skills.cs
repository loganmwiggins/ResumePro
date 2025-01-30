using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Skills
    {
        [Key]
        public Guid SkillId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public virtual Resume Resume { get; set; }

        public required string SkillsDataJson { get; set; }
    }
}
