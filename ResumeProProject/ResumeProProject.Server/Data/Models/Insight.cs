using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Insight
    {
        [JsonIgnore]
        [Key]
        public Guid InsightId { get; set; }

        [ForeignKey("Resume")]
        public Guid ResumeId { get; set; }

        // ✅ Added Navigation Property
        [JsonIgnore]
        public virtual Resume? Resume { get; set; }

        public string? Content { get; set; }
    }
}
