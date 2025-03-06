using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ResumeProProject.Server.Data.Models
{
    public class Comment
    {
        [Key]
        public Guid CommentId { get; set; }

        public required string CommentBody { get; set; }

        public required DateTime DateTimeSubmitted { get; set; }

        //[ForeignKey("User")]
        //public required string Id { get; set; } // User ID

        public string? UserId { get; set; } // User ID, but not an actual fkey

        public string? FullName { get; set; }

        [ForeignKey("Resume")]
        public required Guid ResumeId { get; set; }

        [JsonIgnore]
        public virtual Resume? Resume { get; set; }
    }
}