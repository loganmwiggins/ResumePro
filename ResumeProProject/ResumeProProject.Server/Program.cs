using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore.SqlServer;  // SQL Server support
using Npgsql.EntityFrameworkCore.PostgreSQL;   // PostgreSQL support
using ResumeProProject.Server.Data;
using ResumeProProject.Server.Data.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;


namespace ResumeProProject.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ✅ Add Logging for Debugging
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();
            builder.Logging.AddEventSourceLogger();
            builder.Services.AddSingleton<ILoggerFactory, LoggerFactory>();

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // ✅ Configure CORS
            builder.Services.AddCors(option =>
            {
                option.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            // ✅ Determine Database Provider
            var environment = builder.Environment.IsProduction() ? "Production" : "Development";
            var config = builder.Configuration;

            string connectionString = environment == "Production"
                ? config.GetConnectionString("Production") // Use SQL Server for Production
                : config.GetConnectionString("Development"); // Use PostgreSQL for Development

            if (environment == "Production")
            {
                builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connectionString)); // SQL Server

            }
            else
            {
                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseNpgsql(connectionString)); // PostgreSQL
            }

            //Console.WriteLine($"ASP.NET Environment: {builder.Environment.EnvironmentName}, {environment}");

            builder.Services.AddAuthorization();
            builder.Services.AddIdentityApiEndpoints<User>().AddEntityFrameworkStores<AppDbContext>();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    builder => builder
                        .WithOrigins("https://localhost:5173", "https://localhost:7035","https://resumepro-b8gue3fsf2a8dqex.canadacentral-01.azurewebsites.net") // Allows front-end origin
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()); // For authentication cookies
            });

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.MapIdentityApi<User>();

            app.MapPost("/logout", async (SignInManager<User> signInManager) =>
            {
                await signInManager.SignOutAsync(); // removes cookie
                return Results.Ok();
            }).RequireAuthorization();

            app.MapGet("/pingauth", (ClaimsPrincipal user) =>
            {
                var email = user.FindFirstValue(ClaimTypes.Email); // get email from claim
                return Results.Json(new { Email = email }); ; // return email as plain txt response
            }).RequireAuthorization();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            //app.UseCors("MyPolicy");
            app.UseCors("AllowFrontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}