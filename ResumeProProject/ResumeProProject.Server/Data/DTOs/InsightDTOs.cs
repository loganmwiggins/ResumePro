namespace ResumeProProject.Server.Data.DTOs
{
    public class InsightDTOs
    {
        public class addInsightDTO
        {
            public required Guid resumeId { get; set; }
            public required string content { get; set; }
        }
    }
}
