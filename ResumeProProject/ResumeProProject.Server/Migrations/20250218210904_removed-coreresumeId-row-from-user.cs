using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class removedcoreresumeIdrowfromuser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoreResumeId",
                table: "AspNetUsers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CoreResumeId",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);
        }
    }
}
