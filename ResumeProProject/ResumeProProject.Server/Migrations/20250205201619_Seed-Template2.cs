using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeProProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedTemplate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "TemplateId",
                keyValue: new Guid("4f1d9d3f-09c3-4f3e-bb56-ffdc3d7b6ad0"),
                column: "Content",
                value: "purr");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Templates",
                keyColumn: "TemplateId",
                keyValue: new Guid("4f1d9d3f-09c3-4f3e-bb56-ffdc3d7b6ad0"),
                column: "Content",
                value: "@<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><title>One Line HTML</title></head><body><h1>Hello, World!</h1></body></html>\r\n");
        }
    }
}
