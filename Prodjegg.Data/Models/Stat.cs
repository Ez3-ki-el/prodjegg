using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class Stat
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Label { get; set; } = string.Empty;

    [Required]
    public int Value { get; set; }

    public int Order { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
