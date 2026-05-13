using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class Testimonial
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string ClientName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string ClientTitle { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ClientImagePath { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; } = 5;

    public int Order { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
