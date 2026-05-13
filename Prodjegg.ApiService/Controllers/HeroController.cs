using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroController : ControllerBase
{
    private readonly AppDb _db;

    public HeroController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<HeroSectionDto>> Get()
    {
        var hero = await _db.HeroSections.FirstOrDefaultAsync();
        if (hero == null)
        {
            return NotFound();
        }

        return Ok(new HeroSectionDto
        {
            Id = hero.Id,
            FullName = hero.FullName,
            Title = hero.Title,
            Description = hero.Description,
            ImagePath = hero.ImagePath,
            FacebookUrl = hero.FacebookUrl,
            TwitterUrl = hero.TwitterUrl,
            InstagramUrl = hero.InstagramUrl,
            YoutubeUrl = hero.YoutubeUrl
        });
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<HeroSectionDto>> Update([FromBody] HeroSectionDto dto)
    {
        var hero = await _db.HeroSections.FirstOrDefaultAsync();
        
        if (hero == null)
        {
            hero = new HeroSection();
            _db.HeroSections.Add(hero);
        }

        hero.FullName = dto.FullName;
        hero.Title = dto.Title;
        hero.Description = dto.Description;
        hero.ImagePath = dto.ImagePath;
        hero.FacebookUrl = dto.FacebookUrl;
        hero.TwitterUrl = dto.TwitterUrl;
        hero.InstagramUrl = dto.InstagramUrl;
        hero.YoutubeUrl = dto.YoutubeUrl;
        hero.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }
}
