using System.ComponentModel.DataAnnotations;

namespace Prodjegg.Data.Models;

public class Skill
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100)]
    public int Percentage { get; set; }

    public int Order { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
