using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class IdentityUserLogic6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Skills",
                keyColumn: "SkillId",
                keyValue: new Guid("770e8400-e29b-41d4-a716-446655440000"));

            migrationBuilder.DeleteData(
                table: "Templates",
                keyColumn: "TemplateId",
                keyValue: new Guid("660e8400-e29b-41d4-a716-446655440000"));

            migrationBuilder.DeleteData(
                table: "Resumes",
                keyColumn: "ResumeId",
                keyValue: new Guid("a1234567-bcde-8901-2345-67890abcdef0"));

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "550e8400-e29b-41d4-a716-446655440000");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CoreResumeId", "DateJoined", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "Password", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName", "Username" },
                values: new object[] { "550e8400-e29b-41d4-a716-446655440000", 0, "8843d882-7952-419b-8ca3-e735137c7269", null, new DateTime(2024, 2, 1, 12, 0, 0, 0, DateTimeKind.Utc), null, false, false, null, null, null, "hashedpassword123", null, null, false, "5fcc402a-d4b0-4b10-8dad-304b748e4526", false, null, "testuser" });

            migrationBuilder.InsertData(
                table: "Templates",
                columns: new[] { "TemplateId", "Content", "Name" },
                values: new object[] { new Guid("660e8400-e29b-41d4-a716-446655440000"), "This is a default resume template.", "Default Template" });

            migrationBuilder.InsertData(
                table: "Resumes",
                columns: new[] { "ResumeId", "Id", "Name", "UpdatedDateTime" },
                values: new object[] { new Guid("a1234567-bcde-8901-2345-67890abcdef0"), "550e8400-e29b-41d4-a716-446655440000", "Software Engineer Resume", new DateTime(2024, 2, 1, 12, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.InsertData(
                table: "Skills",
                columns: new[] { "SkillId", "ResumeId", "SkillsDataJson" },
                values: new object[] { new Guid("770e8400-e29b-41d4-a716-446655440000"), new Guid("a1234567-bcde-8901-2345-67890abcdef0"), "[\"C#\",\"JavaScript\",\"Python\",\"SQL\",\"ASP.NET Core\",\"React.js\",\"Docker\",\"REST APIs\",\"Machine Learning\",\"Azure\",\"Git\"]" });
        }
    }
}
