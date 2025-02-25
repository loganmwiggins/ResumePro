using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddColorJsonToResume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ColorJson",
                table: "Resumes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ColorJson",
                table: "Resumes");
        }
    }
}
