using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;  // SQL Server support
using Npgsql.EntityFrameworkCore.PostgreSQL;   // PostgreSQL support
using ResumeProProject.Server.Data.Models;
using System.Text.Json;

namespace ResumeProProject.Server.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Store Enums as Strings for PostgreSQL Compatibility
            modelBuilder.Entity<Education>()
                .Property(s => s.DegreeType)
                .HasConversion<string>();

            modelBuilder.Entity<Experience>()
                .Property(s => s.OfficeType)
                .HasConversion<string>();

            modelBuilder.Entity<Experience>()
                .Property(s => s.JobType)
                .HasConversion<string>();

            // Define Relationships

            // User → Resume (One-to-Many)
            modelBuilder.Entity<Resume>()
                .HasOne(r => r.User)
                .WithMany(u => u.Resumes)
                .HasForeignKey(r => r.Id)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Education (One-to-Many)
            modelBuilder.Entity<Education>()
                .HasOne(e => e.Resume)
                .WithMany(r => r.Educations)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → GeneralInformation (One-to-One)
            modelBuilder.Entity<GeneralInformation>()
                .HasOne(g => g.Resume)
                .WithOne(Resume => Resume.GeneralInformation)
                .HasForeignKey<GeneralInformation>(g => g.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Insights (One-to-One)
            modelBuilder.Entity<Insight>()
                .HasOne(g => g.Resume)
                .WithOne(Resume => Resume.Insights)
                .HasForeignKey<Insight>(g => g.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Comments (One-to-Many)
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Resume)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Certifications (One-to-Many)
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Resume)
                .WithMany(r => r.Certifications)
                .HasForeignKey(c => c.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Experience (One-to-Many)
            modelBuilder.Entity<Experience>()
                .HasOne(e => e.Resume)
                .WithMany(r => r.Experiences)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Projects (One-to-Many)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Resume)
                .WithMany(r => r.Projects)
                .HasForeignKey(p => p.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Resume → Skills (One-to-Many)
            modelBuilder.Entity<Skills>()
                .HasOne(s => s.Resume)
                .WithOne(Resume => Resume.Skills)
                .HasForeignKey<Skills>(s => s.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexing for faster queries

            modelBuilder.Entity<Resume>()
                .HasIndex(r => r.Id)
                .HasDatabaseName("IX_Resume_UserId");

            modelBuilder.Entity<Education>()
                .HasIndex(e => e.ResumeId)
                .HasDatabaseName("IX_Education_ResumeId");

            modelBuilder.Entity<GeneralInformation>()
                .HasIndex(g => g.ResumeId)
                .HasDatabaseName("IX_GeneralInformation_ResumeId");

            modelBuilder.Entity<Insight>()
                .HasIndex(i => i.ResumeId)
                .HasDatabaseName("IX_Insight_ResumeId");

            modelBuilder.Entity<Certification>()
                .HasIndex(c => c.ResumeId)
                .HasDatabaseName("IX_Certification_ResumeId");

            modelBuilder.Entity<Experience>()
                .HasIndex(e => e.ResumeId)
                .HasDatabaseName("IX_Experience_ResumeId");

            modelBuilder.Entity<Project>()
                .HasIndex(p => p.ResumeId)
                .HasDatabaseName("IX_Project_ResumeId");

            modelBuilder.Entity<Skills>()
                .HasIndex(s => s.ResumeId)
                .HasDatabaseName("IX_Skills_ResumeId");
        }

        // Define Tables
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Resume> Resumes { get; set; }
        public virtual DbSet<GeneralInformation> GeneralInformation { get; set; }
        public virtual DbSet<Education> Education { get; set; }
        public virtual DbSet<Certification> Certifications { get; set; }
        public virtual DbSet<Experience> Experiences { get; set; }
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<Skills> Skills { get; set; }
        public virtual DbSet<Insight> Insights { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
    }
}