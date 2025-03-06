using System.ComponentModel.DataAnnotations.Schema;

namespace ResumeProProject.Server.Data.Models
{
    public class Comment
    {
        public Guid CommentId { get; set; }

        public required string CommentBody { get; set; }

        // User ID foreign key can't be null, but needs to be when anonymous ?

        //[ForeignKey("User")]
        //public required string Id { get; set; } // User ID

        [ForeignKey("Resume")]
        public required Guid ResumeId { get; set; }
    }
}