using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Skills
    {
        [Key]
        [JsonIgnore]
        public Guid SkillId { get; set; }

        [JsonIgnore]
        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        [JsonIgnore]
        public virtual Resume? Resume { get; set; }

        public required string SkillsDataJson { get; set; }
    }
}