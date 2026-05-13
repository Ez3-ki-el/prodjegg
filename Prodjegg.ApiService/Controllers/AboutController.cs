using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AboutController : ControllerBase
{
    private readonly AppDb _db;

    public AboutController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<AboutSectionDto>> Get()
    {
        var about = await _db.AboutSections.FirstOrDefaultAsync();
        if (about == null)
        {
            return NotFound();
        }

        return Ok(new AboutSectionDto
        {
            Id = about.Id,
            Title = about.Title,
            Subtitle = about.Subtitle,
            Paragraph1 = about.Paragraph1,
            Paragraph2 = about.Paragraph2,
            Paragraph3 = about.Paragraph3
        });
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<AboutSectionDto>> Update([FromBody] AboutSectionDto dto)
    {
        var about = await _db.AboutSections.FirstOrDefaultAsync();
        
        if (about == null)
        {
            about = new AboutSection();
            _db.AboutSections.Add(about);
        }

        about.Title = dto.Title;
        about.Subtitle = dto.Subtitle;
        about.Paragraph1 = dto.Paragraph1;
        about.Paragraph2 = dto.Paragraph2;
        about.Paragraph3 = dto.Paragraph3;
        about.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }
}
