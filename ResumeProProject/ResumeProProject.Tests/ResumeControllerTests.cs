using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ResumeProProject.Server.Controllers;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Moq;
using static ResumeProProject.Server.Data.DTOs.ResumeDTOs;
public class ResumeControllerTests : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly ResumeController _controller;

    public ResumeControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new AppDbContext(options);

        var userStoreMock = new Mock<IUserStore<User>>();
        var userManagerMock = new Mock<UserManager<User>>(
            userStoreMock.Object,
            null, null, null, null, null, null, null, null
        );

        _controller = new ResumeController(_dbContext, userManagerMock.Object);
    }

    [Fact]
    public async Task GetResumes_ReturnsEmptyList_IfNoneExist()
    {
        // Arrange
        var nonexistentUserId = Guid.NewGuid().ToString();

        // Act
        var result = await _controller.GetResumes(nonexistentUserId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var resumes = Assert.IsType<List<object>>(okResult.Value);
        Assert.Empty(resumes);
    }

    //[Fact]
    //public async Task DeleteResume_ReturnsOk_WhenResumeExists()
    //{
    //    // Arrange
    //    var resume = new Resume
    //    {
    //        ResumeId = Guid.NewGuid(),
    //        Id = Guid.NewGuid().ToString(),
    //        Name = "Test Resume",
    //        UpdatedDateTime = DateTime.UtcNow,
    //        ColorJson = "{}",              // Required
    //        TemplateId = "minimal",        // Required
    //        Thumbnail = "thumbnail.png",   // Required
    //        TextSize = 1
    //    };

    //    _dbContext.Resumes.Add(resume);
    //    await _dbContext.SaveChangesAsync();

    //    // Act
    //    var result = await _controller.DeleteResume(resume.ResumeId);

    //    // Assert
    //    var okResult = Assert.IsType<OkObjectResult>(result);

    //    // Read the response as a plain object and validate its contents
    //    var response = okResult.Value?.ToString();
    //    Assert.NotNull(response);
    //    Assert.Contains("Resume deleted successfully", response);
    //    Assert.Contains(resume.ResumeId.ToString(), response);
    //}


    //public class MessageResponse
    //{
    //    public string Message { get; set; }
    //    public Guid ResumeId { get; set; } 
    //}
    [Fact]
    public async Task GetResumeById_ReturnsResume_WhenExists()
    {
        // Arrange
        var resumeId = Guid.NewGuid();
        var userId = Guid.NewGuid().ToString();

        var resume = new Resume
        {
            ResumeId = resumeId,
            Id = userId,
            Name = "Test Resume",
            UpdatedDateTime = DateTime.UtcNow,
            ColorJson = "{}",
            TemplateId = "classic",
            Thumbnail = "preview.png",
            TextSize = 1, //make sure to not repeat code
            GeneralInformation = new GeneralInformation
            {
                ResumeId = resumeId,
                FirstName = "Maggie",
                LastName = "Rivas",
                Email = "maggie@example.com"
            },
            Skills = new Skills
            {
                ResumeId = resumeId,
                SkillsDataJson = "[\"C#\",\"SQL\"]"
            },
            Projects = new List<Project>
        {
            new Project
            {
                ResumeId = resumeId,
                Title = "ResumePro",
                Description = "A resume builder platform",
                OrderNumber = 1
            }
        }
        };

        _dbContext.Resumes.Add(resume);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _controller.GetResume(resumeId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var content = okResult.Value?.ToString();

        Assert.NotNull(content);
        Assert.Contains("Test Resume", content);
    }
    [Fact]
    public async Task GetResumeById_ReturnsNotFound_WhenMissing()
    {
        // Arrange
        var missingResumeId = Guid.NewGuid(); // this resume is never added to the DB

        // Act
        var result = await _controller.GetResume(missingResumeId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);

        var content = notFoundResult.Value?.ToString();
        Assert.NotNull(content);
        Assert.Contains("Resume not found", content);
    }

    [Fact]
    public async Task RenameResume_ReturnsOk_WhenResumeRenamed()
    {
        // Arrange
        var resumeId = Guid.NewGuid();
        var resume = new Resume
        {
            ResumeId = resumeId,
            Id = Guid.NewGuid().ToString(),
            Name = "Old Name",
            UpdatedDateTime = DateTime.UtcNow.AddDays(-1),
            ColorJson = "{}",
            TemplateId = "classic",
            Thumbnail = "thumb.png",
            TextSize = 1
        };

        _dbContext.Resumes.Add(resume);
        await _dbContext.SaveChangesAsync();

        var newName = "New Name";
        var newTime = DateTime.UtcNow;

        var request = new RenameResumeDto
        {
            resumeId = resumeId,
            newName = newName,
            newTime = newTime
        };

        // Act
        var result = await _controller.RenameResume(request); //make sure there is error handling

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var content = okResult.Value?.ToString();

        Assert.NotNull(content);
        Assert.Contains("Resume renamed successfully", content);
        Assert.Contains(resumeId.ToString(), content);

        var updatedResume = await _dbContext.Resumes.FindAsync(resumeId);
        Assert.Equal(newName, updatedResume.Name);
        Assert.Equal(newTime, updatedResume.UpdatedDateTime, TimeSpan.FromSeconds(1));
    }
    [Fact]
    public async Task DuplicateResume_ReturnsOk_WhenResumeDuplicated()
    {
        // Arrange
        var originalId = Guid.NewGuid();
        var userId = Guid.NewGuid().ToString();
        var now = DateTime.UtcNow;

        var resume = new Resume
        {
            ResumeId = originalId,
            Id = userId,
            Name = "Original Resume",
            UpdatedDateTime = now.AddDays(-2),
            ColorJson = "{}",
            TemplateId = "modern",
            Thumbnail = "thumb.png",
            TextSize = 1,
            GeneralInformation = new GeneralInformation
            {
                ResumeId = originalId,
                FirstName = "Meg",
                LastName = "Rivas",
                Email = "meg@jmfamily.com"
            },
            Skills = new Skills
            {
                ResumeId = originalId,
                SkillsDataJson = "[\"C#\", \".NET\"]"
            },
            Projects = new List<Project>
        {
            new Project
            {
                ResumeId = originalId,
                Title = "ResumePro",
                Description = "Built a resume platform.",
                OrderNumber = 1
            }
        }
        };

        _dbContext.Resumes.Add(resume);
        await _dbContext.SaveChangesAsync();

        var duplicateDto = new DuplicateResumeDto
        {
            resumeId = originalId,
            CurrentDate = now
        };

        // Act
        var result = await _controller.DuplicateResume(duplicateDto);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var content = okResult.Value?.ToString();

        Assert.NotNull(content);
        Assert.Contains("Resume duplicated successfully", content);

        var newResume = _dbContext.Resumes
            .Where(r => r.Id == userId && r.UpdatedDateTime == now)
            .Include(r => r.GeneralInformation)
            .Include(r => r.Projects)
            .FirstOrDefault();

        Assert.NotNull(newResume);
        Assert.StartsWith("Original Resume", newResume.Name);
        Assert.Equal("Meg", newResume.GeneralInformation.FirstName);
        Assert.Single(newResume.Projects);
    }

}
