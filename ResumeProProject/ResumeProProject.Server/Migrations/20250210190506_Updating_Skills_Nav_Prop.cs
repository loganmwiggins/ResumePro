using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class Updating_Skills_Nav_Prop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Skills_ResumeId",
                table: "Skills");

            migrationBuilder.AddColumn<Guid>(
                name: "ResumeId1",
                table: "Skills",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Skills_ResumeId",
                table: "Skills",
                column: "ResumeId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Skills_ResumeId1",
                table: "Skills",
                column: "ResumeId1",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Skills_Resumes_ResumeId1",
                table: "Skills",
                column: "ResumeId1",
                principalTable: "Resumes",
                principalColumn: "ResumeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Skills_Resumes_ResumeId1",
                table: "Skills");

            migrationBuilder.DropIndex(
                name: "IX_Skills_ResumeId",
                table: "Skills");

            migrationBuilder.DropIndex(
                name: "IX_Skills_ResumeId1",
                table: "Skills");

            migrationBuilder.DropColumn(
                name: "ResumeId1",
                table: "Skills");

            migrationBuilder.CreateIndex(
                name: "IX_Skills_ResumeId",
                table: "Skills",
                column: "ResumeId");
        }
    }
}
