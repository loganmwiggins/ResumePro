using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class updatedDBContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ResumeId2",
                table: "GeneralInformation",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Insights",
                columns: table => new
                {
                    InsightId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Insights", x => x.InsightId);
                    table.ForeignKey(
                        name: "FK_Insights_Resumes_ResumeId",
                        column: x => x.ResumeId,
                        principalTable: "Resumes",
                        principalColumn: "ResumeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GeneralInformation_ResumeId2",
                table: "GeneralInformation",
                column: "ResumeId2",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Insights_ResumeId",
                table: "Insights",
                column: "ResumeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GeneralInformation_Resumes_ResumeId2",
                table: "GeneralInformation",
                column: "ResumeId2",
                principalTable: "Resumes",
                principalColumn: "ResumeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GeneralInformation_Resumes_ResumeId2",
                table: "GeneralInformation");

            migrationBuilder.DropTable(
                name: "Insights");

            migrationBuilder.DropIndex(
                name: "IX_GeneralInformation_ResumeId2",
                table: "GeneralInformation");

            migrationBuilder.DropColumn(
                name: "ResumeId2",
                table: "GeneralInformation");
        }
    }
}
