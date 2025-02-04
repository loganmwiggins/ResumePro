using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace ResumeProProject.Server.Data.Models;

public class Project
{
    [JsonIgnore]
    [Key]
    public Guid ProjectId { get; set; }
    [JsonIgnore]
    [ForeignKey("Resume")]
    public Guid ResumeId { get; set; }

    public required string Title { get; set; }
    public required string Description { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    [JsonIgnore]
    public virtual Resume? Resume { get; set; }
}
