using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class HeroSection
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImagePath { get; set; } = string.Empty;

    [MaxLength(200)]
    public string FacebookUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string TwitterUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string InstagramUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string YoutubeUrl { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
