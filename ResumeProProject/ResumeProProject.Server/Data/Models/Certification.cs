using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Certification
    {
        [Key]
        public Guid CertificationId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string Name { get; set; }

        public required string Issuer { get; set; }

        public required DateOnly IssueDate { get; set; }

        public DateOnly? ExpireDate { get; set; }

        // ✅ Navigation Property
        public virtual Resume Resume { get; set; }
 
    }
}