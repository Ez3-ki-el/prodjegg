using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class Service
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string IconClass { get; set; } = string.Empty;

    public int Order { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
