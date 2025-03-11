using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_Resumes_Id",
                table: "Resumes",
                newName: "IX_Resume_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Projects_ResumeId",
                table: "Projects",
                newName: "IX_Project_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Insights_ResumeId",
                table: "Insights",
                newName: "IX_Insight_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Experiences_ResumeId",
                table: "Experiences",
                newName: "IX_Experience_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Certifications_ResumeId",
                table: "Certifications",
                newName: "IX_Certification_ResumeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_Resume_UserId",
                table: "Resumes",
                newName: "IX_Resumes_Id");

            migrationBuilder.RenameIndex(
                name: "IX_Project_ResumeId",
                table: "Projects",
                newName: "IX_Projects_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Insight_ResumeId",
                table: "Insights",
                newName: "IX_Insights_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Experience_ResumeId",
                table: "Experiences",
                newName: "IX_Experiences_ResumeId");

            migrationBuilder.RenameIndex(
                name: "IX_Certification_ResumeId",
                table: "Certifications",
                newName: "IX_Certifications_ResumeId");
        }
    }
}
