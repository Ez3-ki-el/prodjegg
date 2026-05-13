using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class PortfolioItem
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string ImagePath { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ProjectUrl { get; set; } 

    public int Order { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
