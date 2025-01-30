using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ResumeProProject.Server.Data.Models
{
    public class User: IdentityUser
    {
        //[Key]
        //public Guid UserId { get; set; }

        //public string Username { get; set; }

        //public string Password { get; set; }

        public DateTime? DateJoined { get; set; }

        public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

        [ForeignKey("Resume")]
        public Guid? CoreResumeId { get; set; }
    }
}