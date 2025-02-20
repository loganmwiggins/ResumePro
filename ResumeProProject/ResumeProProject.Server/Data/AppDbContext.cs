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

            // ✅ Store Enums as Strings for PostgreSQL Compatibility
            modelBuilder.Entity<Education>()
                .Property(s => s.DegreeType)
                .HasConversion<string>();

            modelBuilder.Entity<Experience>()
                .Property(s => s.OfficeType)
                .HasConversion<string>();

            modelBuilder.Entity<Experience>()
                .Property(s => s.JobType)
                .HasConversion<string>();

            // ✅ Define Relationships (Fixed Foreign Keys)

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

            //    // ✅ Use Hardcoded GUIDs
            //    var userId = "550e8400-e29b-41d4-a716-446655440000";
            //    var resumeId = Guid.Parse("a1234567-bcde-8901-2345-67890abcdef0");
            //    var skillId = Guid.Parse("770e8400-e29b-41d4-a716-446655440000");

            //    // ✅ Use Hardcoded DateTime
            //    var fixedDateTime = new DateTime(2024, 2, 1, 12, 0, 0, DateTimeKind.Utc);

            //    // ✅ Seed User
            //    modelBuilder.Entity<User>().HasData(new User
            //    {
            //        Id = userId,
            //        Username = "testuser",
            //        Password = "hashedpassword123",
            //        DateJoined = fixedDateTime
            //    });

            //    // ✅ Seed Resume
            //    modelBuilder.Entity<Resume>().HasData(new Resume
            //    {
            //        ResumeId = resumeId,
            //        Id = userId,
            //        Name = "Software Engineer Resume",
            //        UpdatedDateTime = fixedDateTime
            //    });

            //    // ✅ Seed Skills
            //    modelBuilder.Entity<Skills>().HasData(new Skills
            //    {s
            //        SkillId = skillId,
            //        ResumeId = resumeId,
            //        SkillsDataJson = System.Text.Json.JsonSerializer.Serialize(new List<string>
            //{
            //    "C#", "JavaScript", "Python", "SQL", "ASP.NET Core",
            //    "React.js", "Docker", "REST APIs", "Machine Learning", "Azure", "Git"
            //})
            //    });
        }



        // ✅ Define Tables
        public DbSet<User> Users { get; set; }
        public DbSet<Resume> Resumes { get; set; }
        public DbSet<GeneralInformation> GeneralInformation { get; set; }
        public DbSet<Education> Education { get; set; }
        public DbSet<Certification> Certifications { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Skills> Skills { get; set; }
        public DbSet<Insight> Insights { get; set; }
    }
}