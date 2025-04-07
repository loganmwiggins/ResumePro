using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using ResumeProProject.Server.Controllers;
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using static ResumeProProject.Server.Data.DTOs.CommentDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Identity;

namespace ResumeProProject.Tests
{
    public class CommentControllerTests
    {
        private readonly Mock<AppDbContext> _mockDbContext;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly Mock<ILogger<ResumeController>> _mockLogger;
        private readonly CommentController _controller;

        public CommentControllerTests()
        {
            _mockDbContext = new Mock<AppDbContext>(new DbContextOptions<AppDbContext>());
            _mockUserManager = new Mock<UserManager<User>>(
                Mock.Of<IUserStore<User>>(),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );
            _mockLogger = new Mock<ILogger<ResumeController>>();
            _controller = new CommentController(_mockDbContext.Object, _mockUserManager.Object);
        }

        [Fact]
        public async Task GetCommentsByResume_ReturnsOkResult_WithComments()
        {
            // Arrange
            var resumeId = Guid.NewGuid();
            var comments = new List<Comment>
                {
                    new Comment { CommentId = Guid.NewGuid(), ResumeId = resumeId, CommentBody = "Test Comment", DateTimeSubmitted = DateTime.UtcNow }
                }.AsQueryable();

            var mockSet = new Mock<DbSet<Comment>>();
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Comment>(comments.Provider));
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Expression).Returns(comments.Expression);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.ElementType).Returns(comments.ElementType);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.GetEnumerator()).Returns(comments.GetEnumerator());
            mockSet.As<IAsyncEnumerable<Comment>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>())).Returns(new TestAsyncEnumerator<Comment>(comments.GetEnumerator()));

            _mockDbContext.Setup(c => c.Comments).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetCommentsByResume(resumeId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Comment>>(okResult.Value);
            Assert.Single(returnValue);
        }

        [Fact]
        public async Task GetCommentsByResume_ReturnsOkResult_WithEmptyList()
        {
            // Arrange
            var resumeId = Guid.NewGuid();
            var comments = new List<Comment>().AsQueryable();

            var mockSet = new Mock<DbSet<Comment>>();
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Comment>(comments.Provider));
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Expression).Returns(comments.Expression);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.ElementType).Returns(comments.ElementType);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.GetEnumerator()).Returns(comments.GetEnumerator());
            mockSet.As<IAsyncEnumerable<Comment>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>())).Returns(new TestAsyncEnumerator<Comment>(comments.GetEnumerator()));

            _mockDbContext.Setup(c => c.Comments).Returns(mockSet.Object);

            // Act
            var result = await _controller.GetCommentsByResume(resumeId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<object>>(okResult.Value);
            Assert.Empty(returnValue);
        }




        [Fact]
        public async Task AddComment_ReturnsOkResult_WithNewComment()
        {
            // Arrange
            var commentDTO = new AddCommentDTO
            {
                ResumeId = Guid.NewGuid(),
                UserId = "user123",
                FullName = "Test User",
                UserImage = "testimage.png",
                CommentBody = "Test Comment"
            };

            var resume = new Resume
            {
                ResumeId = commentDTO.ResumeId,
                TextSize = 12.0,
                Id = "defaultId"
            };

            var mockSet = new Mock<DbSet<Resume>>();
            mockSet.As<IQueryable<Resume>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Resume>(new List<Resume> { resume }.AsQueryable().Provider));
            mockSet.As<IQueryable<Resume>>().Setup(m => m.Expression).Returns(new List<Resume> { resume }.AsQueryable().Expression);
            mockSet.As<IQueryable<Resume>>().Setup(m => m.ElementType).Returns(new List<Resume> { resume }.AsQueryable().ElementType);
            mockSet.As<IQueryable<Resume>>().Setup(m => m.GetEnumerator()).Returns(new List<Resume> { resume }.AsQueryable().GetEnumerator());
            mockSet.Setup(m => m.FindAsync(commentDTO.ResumeId)).ReturnsAsync(resume);

            _mockDbContext.Setup(c => c.Resumes).Returns(mockSet.Object);
            _mockDbContext.Setup(c => c.Comments.Add(It.IsAny<Comment>()));
            _mockDbContext.Setup(c => c.SaveChangesAsync(default)).ReturnsAsync(1);

            // Act
            var result = await _controller.AddComment(commentDTO);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
           
        }

        [Fact]
        public async Task DeleteInsight_ReturnsOkResult_WhenCommentExists()
        {
            // Arrange
            var commentId = Guid.NewGuid();
            var comment = new Comment
            {
                CommentId = commentId,
                CommentBody = "Test Comment",
                DateTimeSubmitted = DateTime.UtcNow,
                ResumeId = Guid.NewGuid()
            };

            var comments = new List<Comment> { comment }.AsQueryable();

            var mockSet = new Mock<DbSet<Comment>>();
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Comment>(comments.Provider));
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Expression).Returns(comments.Expression);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.ElementType).Returns(comments.ElementType);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.GetEnumerator()).Returns(comments.GetEnumerator());
            mockSet.As<IAsyncEnumerable<Comment>>().Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>())).Returns(new TestAsyncEnumerator<Comment>(comments.GetEnumerator()));
            mockSet.Setup(m => m.Remove(It.IsAny<Comment>())).Callback<Comment>(c => comments = comments.Where(x => x.CommentId != c.CommentId).AsQueryable());

            _mockDbContext.Setup(c => c.Comments).Returns(mockSet.Object);

            // Act
            var result = await _controller.DeleteInsight(commentId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            
        }


        [Fact]
        public async Task DeleteInsight_ReturnsNotFound_WhenCommentDoesNotExist()
        {
            // Arrange
            var commentId = Guid.NewGuid();

            var mockSet = new Mock<DbSet<Comment>>();
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<Comment>(new List<Comment>().AsQueryable().Provider));
            mockSet.As<IQueryable<Comment>>().Setup(m => m.Expression).Returns(new List<Comment>().AsQueryable().Expression);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.ElementType).Returns(new List<Comment>().AsQueryable().ElementType);
            mockSet.As<IQueryable<Comment>>().Setup(m => m.GetEnumerator()).Returns(new List<Comment>().AsQueryable().GetEnumerator());
            mockSet.Setup(m => m.FindAsync(commentId)).ReturnsAsync((Comment)null);

            _mockDbContext.Setup(c => c.Comments).Returns(mockSet.Object);

            // Act
            var result = await _controller.DeleteInsight(commentId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Comment does not exist.", notFoundResult.Value);
        }
    }
}
