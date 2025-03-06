using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Insight
    {
        public string? Content { get; set; }

        [JsonIgnore]
        [Key]
        public Guid InsightId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        [JsonIgnore]
        public virtual Resume? Resume { get; set; }
    }
}