namespace ResumeProProject.Server.Data.DTOs
{
    public class CommentDTOs
    {
        public class AddCommentDTO
        {
            public required Guid ResumeId { get; set; }
            public required string UserId { get; set; }
            public required string CommentBody { get; set; }
        }
    }
}