using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Resume
    {
        [Key]
        public Guid ResumeId { get; set; }

        public string Name { get; set; }

        public DateTime UpdatedDateTime { get; set; } = DateTime.UtcNow;

        // ✅ Explicitly define foreign key mapping
        [ForeignKey("User")]
        public string Id { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<Education> Educations { get; set; } = new List<Education>();
        public virtual ICollection<Experience> Experiences { get; set; } = new List<Experience>();
        public virtual ICollection<Certification> Certifications { get; set; } = new List<Certification>();
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
        public virtual ICollection<Skills> Skills { get; set; } = new List<Skills>();
    }
}