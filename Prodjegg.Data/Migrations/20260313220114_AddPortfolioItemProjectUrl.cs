using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Prodjegg.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPortfolioItemProjectUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectUrl",
                table: "PortfolioItems",
                type: "TEXT",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectUrl",
                table: "PortfolioItems");
        }
    }
}
