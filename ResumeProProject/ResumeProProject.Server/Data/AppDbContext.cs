using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.Models;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection.Emit;
namespace ResumeProProject.Server.Data
{
    public class AppDbContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public AppDbContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server with connection string from app settings
            options.UseSqlServer(Configuration.GetConnectionString("ResumePro"));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Education>()
                .Property(s => s.DegreeType)
                .HasConversion<string>(); // Store enum as string

            modelBuilder.Entity<Experience>()
                .Property(s => s.OfficeType)
                .HasConversion<string>(); // Store enum as string


            modelBuilder.Entity<Experience>()
                .Property(s => s.JobType)
                .HasConversion<string>(); // Store enum as string
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Resume> Resumes { get; set; }
    }
}