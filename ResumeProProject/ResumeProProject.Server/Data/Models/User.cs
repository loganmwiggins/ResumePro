using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class User : IdentityUser
    {
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime? DateJoined { get; set; }

        public bool IsFirstLogin { get; set; } = true;

        public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

        [ForeignKey("Resume")]
        public Guid? CoreResumeId { get; set; }
    }
}