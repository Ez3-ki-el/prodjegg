using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class AboutSection
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Subtitle { get; set; } = string.Empty;

    [Required]
    public string Paragraph1 { get; set; } = string.Empty;

    [Required]
    public string Paragraph2 { get; set; } = string.Empty;

    [Required]
    public string Paragraph3 { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
