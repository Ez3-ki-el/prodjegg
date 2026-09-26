namespace Prodjegg.Data.Models;

public class SiteSettings
{
    public int Id { get; set; }

    public bool ShowServices { get; set; } = true;
    public bool ShowPortfolio { get; set; } = true;
    public bool ShowTestimonials { get; set; } = true;
    public bool ShowStats { get; set; } = true;
    public bool ShowSkills { get; set; } = true;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
