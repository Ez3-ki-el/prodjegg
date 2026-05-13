namespace Prodjegg.ApiService.DTOs;

public class HeroSectionDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string FacebookUrl { get; set; } = string.Empty;
    public string TwitterUrl { get; set; } = string.Empty;
    public string InstagramUrl { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
}

public class AboutSectionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Paragraph1 { get; set; } = string.Empty;
    public string Paragraph2 { get; set; } = string.Empty;
    public string Paragraph3 { get; set; } = string.Empty;
}

public class ServiceDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconClass { get; set; } = string.Empty;
    public int Order { get; set; }
}

public class PortfolioItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? ProjectUrl { get; set; }
    public int Order { get; set; }
}

public class TestimonialDto
{
    public int Id { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientTitle { get; set; } = string.Empty;
    public string ClientImagePath { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public int Order { get; set; }
}

public class StatDto
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public int Value { get; set; }
    public int Order { get; set; }
}

public class SkillDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Percentage { get; set; }
    public int Order { get; set; }
}

public class CtaSectionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}
