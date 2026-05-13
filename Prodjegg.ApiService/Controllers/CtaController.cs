using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CtaController : ControllerBase
{
    private readonly AppDb _db;

    public CtaController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<CtaSectionDto>> Get()
    {
        var cta = await _db.CtaSections.FirstOrDefaultAsync();
        if (cta == null)
        {
            return NotFound();
        }

        return Ok(new CtaSectionDto
        {
            Id = cta.Id,
            Title = cta.Title,
            Description = cta.Description,
            ImagePath = cta.ImagePath,
            Email = cta.Email,
            PhoneNumber = cta.PhoneNumber
        });
    }

    [Authorize]
    [HttpPut]
    public async Task<ActionResult<CtaSectionDto>> Update([FromBody] CtaSectionDto dto)
    {
        var cta = await _db.CtaSections.FirstOrDefaultAsync();
        
        if (cta == null)
        {
            cta = new CtaSection();
            _db.CtaSections.Add(cta);
        }

        cta.Title = dto.Title;
        cta.Description = dto.Description;
        cta.ImagePath = dto.ImagePath;
        cta.Email = dto.Email;
        cta.PhoneNumber = dto.PhoneNumber;
        cta.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }
}
