namespace ResumeProProject.Server.Data.DTOs
{
    public class CommentDTOs
    {
        public class AddCommentDTO
        {
            public required Guid ResumeId { get; set; }
            public string? UserId { get; set; }
            public string? FullName { get; set; }
            public required string CommentBody { get; set; }
        }
    }
}