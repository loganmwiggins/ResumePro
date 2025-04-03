using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ResumeProProject.Server.Controllers;
using ResumeProProject.Server.Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Http;

public class UserControllerTests
{
    private readonly Mock<UserManager<User>> _mockUserManager;
    private readonly Mock<SignInManager<User>> _mockSignInManager;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        var userStoreMock = new Mock<IUserStore<User>>();
        _mockUserManager = new Mock<UserManager<User>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
        _mockSignInManager = new Mock<SignInManager<User>>(_mockUserManager.Object, Mock.Of<IHttpContextAccessor>(), Mock.Of<IUserClaimsPrincipalFactory<User>>(), null, null, null, null);

        _controller = new UserController(_mockUserManager.Object, _mockSignInManager.Object);
    }

    [Fact]
    public async Task Register_User_Fails()
    {
        // Arrange
        var request = new CustomRegisterRequest
        {
            Email = "test@example.com",
            Password = "Test@1234"
        };

        _mockUserManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                        .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Invalid Password" }));

        // Act
        var result = await _controller.Register(request);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetAllUsers_ReturnsUsers()
    {
        var userId = Guid.NewGuid().ToString();
        var userId2 = Guid.NewGuid().ToString();
        // Arrange
        var users = new List<User>
        {
            new User { Id = userId, Email = "test1@example.com", FirstName = "John", LastName = "Doe" },
            new User { Id = userId2, Email = "test2@example.com", FirstName = "Jane", LastName = "Doe" }
        }.AsQueryable();

        _mockUserManager.Setup(x => x.Users).Returns(users);

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = okResult.Value as IEnumerable<object>;
        Assert.Equal(2, response.Count());
    }

    [Fact]
    public async Task GetAllUsers_ReturnsNotFound()
    {
        // Arrange
        _mockUserManager.Setup(x => x.Users).Returns(new List<User>().AsQueryable());

        // Act
        var result = await _controller.GetAllUsers();

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetUserById_ReturnsNotFound()
    {
        // Arrange
        _mockUserManager.Setup(x => x.FindByIdAsync("1")).ReturnsAsync((User)null);

        // Act
        var result = await _controller.GetUserById("1");

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateUser_ReturnsSuccess()
    {
        var userId = Guid.NewGuid().ToString();
        // Arrange
        var user = new User { Id = userId, Email = "old@example.com", FirstName = "John", LastName = "Doe" };
        _mockUserManager.Setup(x => x.FindByIdAsync("1")).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

        var request = new UpdateUserRequest { UserId = "1", Email = "new@example.com" };

        // Act
        var result = await _controller.UpdateUser(request);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task UpdateUser_ReturnsNotFound()
    {
        var userId = Guid.NewGuid().ToString();
        // Arrange
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync((User)null);

        var request = new UpdateUserRequest { UserId = userId, Email = "new@example.com" };

        // Act
        var result = await _controller.UpdateUser(request);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteUser_ReturnsSuccess()
    {
        var userId = Guid.NewGuid().ToString();
        // Arrange
        var user = new User { Id = userId, Email = "test@example.com" };
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync(user);
        _mockUserManager.Setup(x => x.DeleteAsync(user)).ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.DeleteUser(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNotFound()
    {
        var userId = Guid.NewGuid().ToString();
        // Arrange
        _mockUserManager.Setup(x => x.FindByIdAsync(userId)).ReturnsAsync((User)null);

        // Act
        var result = await _controller.DeleteUser(userId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }
}
