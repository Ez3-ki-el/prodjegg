using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDb _db;

    public SettingsController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<SiteSettingsDto>> Get()
    {
        var settings = await _db.SiteSettings.FirstOrDefaultAsync();
        settings ??= new SiteSettings();

        return Ok(new SiteSettingsDto
        {
            Id = settings.Id,
            ShowServices = settings.ShowServices,
            ShowPortfolio = settings.ShowPortfolio,
            ShowTestimonials = settings.ShowTestimonials,
            ShowStats = settings.ShowStats,
            ShowSkills = settings.ShowSkills
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult<SiteSettingsDto>> Update([FromBody] SiteSettingsDto dto)
    {
        var settings = await _db.SiteSettings.FirstOrDefaultAsync();

        if (settings == null)
        {
            settings = new SiteSettings();
            _db.SiteSettings.Add(settings);
        }

        settings.ShowServices = dto.ShowServices;
        settings.ShowPortfolio = dto.ShowPortfolio;
        settings.ShowTestimonials = dto.ShowTestimonials;
        settings.ShowStats = dto.ShowStats;
        settings.ShowSkills = dto.ShowSkills;
        settings.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }
}
