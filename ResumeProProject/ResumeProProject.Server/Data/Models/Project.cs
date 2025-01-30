using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ResumeProProject.Server.Data.Models;

public class Project
{
    [Key]
    public required Guid ProjectId { get; set; }

    [ForeignKey("Resume")]
    public required Guid ResumeId { get; set; }

    public required string Description { get; set; }

    public virtual Resume Resume { get; set; }
}