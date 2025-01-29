using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; }

        public required string Username { get; set; }

        public required string Password { get; set; }

        public required DateTime DateJoined { get; set; }

        public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

        [ForeignKey("Resume")]
        public Guid? CoreResumeId { get; set; }
    }
}