using Microsoft.EntityFrameworkCore;
using ResumeProProject.Server.Data.Models;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection.Emit;
namespace ResumeProProject.Server.Data
{
    public class AppDbContext : DbContext
    {
        //protected override void OnConfiguring(DbContextOptionsBuilder options)
        //{
        // // Connect to sql server with connection string from app settings
        //options.UseSqlServer(Configuration.GetConnectionString("ResumePro"));
        //}

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        // Entity Relationships
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


        // Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<Template> Templates { get; set; }

        public DbSet<GeneralInformation> GeneralInformations { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Skills> Skills { get; set; }
    }
}