﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Resume
    {
        [Key]
        public Guid ResumeId { get; set; }

        public string Name { get; set; }

        public DateTime UpdatedDateTime { get; set; } = DateTime.UtcNow;

        public string TemplateId { get; set; }

        public string ColorJson { get; set; }

        public required double TextSize { get; set; } = 1;

        [ForeignKey("User")]
        public required string Id { get; set; } //THIS IS THE USER ID
        [JsonIgnore]
        public virtual User User { get; set; }
        public string Thumbnail { get; set; }

        public virtual ICollection<Education> Educations { get; set; } = new List<Education>();
        public virtual ICollection<Experience> Experiences { get; set; } = new List<Experience>();
        public virtual ICollection<Certification> Certifications { get; set; } = new List<Certification>();
        public virtual ICollection<Project> Projects { get; set; } = new List<Project>();
        public virtual Skills? Skills { get; set; }
        public virtual GeneralInformation GeneralInformation { get; set; }
        public virtual Insight Insights { get; set; }
    }
}