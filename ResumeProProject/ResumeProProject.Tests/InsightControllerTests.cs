using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using ResumeProProject.Server.Controllers;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using static ResumeProProject.Server.Data.DTOs.InsightDTOs;

public class InsightControllerTests
{
    private readonly AppDbContext _dbContext;
    private readonly InsightController _controller;

    public InsightControllerTests()
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

        _controller = new InsightController(_dbContext, userManagerMock.Object);
    }

    [Fact]
    public async Task AddInsight_AddsSuccessfully()
    {
        var resumeId = Guid.NewGuid();
        _dbContext.Resumes.Add(new Resume
        {
            ResumeId = resumeId,
            Id = Guid.NewGuid().ToString(),
            Name = "Resume With Insight",
            UpdatedDateTime = DateTime.UtcNow,
            ColorJson = "{}",
            TemplateId = "clean",
            Thumbnail = "thumb.png",
            TextSize = 1
        });
        await _dbContext.SaveChangesAsync();

        var request = new addInsightDTO
        {
            resumeId = resumeId,
            content = "This resume could use a summary."
        };

        var result = await _controller.AddInsight(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("Insight added successfully", okResult.Value.ToString());

        var insight = await _dbContext.Insights.FirstOrDefaultAsync(i => i.ResumeId == resumeId);
        Assert.NotNull(insight);
        Assert.Equal(request.content, insight.Content);
    }

    [Fact]
    public async Task GetInsight_ReturnsContent_WhenExists()
    {
        var resumeId = Guid.NewGuid();
        _dbContext.Insights.Add(new Insight
        {
            ResumeId = resumeId,
            Content = "Great structure and formatting!"
        });
        await _dbContext.SaveChangesAsync();

        var result = await _controller.GetInsight(resumeId);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var content = Assert.IsType<string>(okResult.Value);
        Assert.Equal("Great structure and formatting!", content);
    }

    [Fact]
    public async Task GetInsight_ReturnsNotFound_WhenMissing()
    {
        var resumeId = Guid.NewGuid();

        var result = await _controller.GetInsight(resumeId);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("No insights found for this resume.", notFound.Value);
    }

    [Fact]
    public async Task DeleteInsight_DeletesSuccessfully()
    {
        var resumeId = Guid.NewGuid();
        _dbContext.Insights.Add(new Insight
        {
            ResumeId = resumeId,
            Content = "Too many buzzwords."
        });
        await _dbContext.SaveChangesAsync();

        var result = await _controller.DeleteInsight(resumeId);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("Insight deleted successfully", okResult.Value.ToString());

        var insight = await _dbContext.Insights.FirstOrDefaultAsync(i => i.ResumeId == resumeId);
        Assert.Null(insight);
    }

    [Fact]
    public async Task DeleteInsight_ReturnsNotFound_WhenMissing()
    {
        var resumeId = Guid.NewGuid();

        var result = await _controller.DeleteInsight(resumeId);

        var notFound = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("No insights found for this resume.", notFound.Value);
    }
}
