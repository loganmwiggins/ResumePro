using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class updatedresumemodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "EndDate",
                table: "Projects",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "StartDate",
                table: "Projects",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ResumeId1",
                table: "GeneralInformation",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GeneralInformation_ResumeId1",
                table: "GeneralInformation",
                column: "ResumeId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GeneralInformation_Resumes_ResumeId1",
                table: "GeneralInformation",
                column: "ResumeId1",
                principalTable: "Resumes",
                principalColumn: "ResumeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GeneralInformation_Resumes_ResumeId1",
                table: "GeneralInformation");

            migrationBuilder.DropIndex(
                name: "IX_GeneralInformation_ResumeId1",
                table: "GeneralInformation");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ResumeId1",
                table: "GeneralInformation");
        }
    }
}
