using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Certification
    {
        [Key]
        public Guid CertificationId { get; set; }
        [JsonIgnore]
        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        public required string Name { get; set; }

        public required string Issuer { get; set; }

        public required DateOnly IssueDate { get; set; }

        public DateOnly? ExpireDate { get; set; }

        // ✅ Navigation Property
        [JsonIgnore]
        public virtual Resume? Resume { get; set; }

    }
}