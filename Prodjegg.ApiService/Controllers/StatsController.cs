using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDb _db;

    public StatsController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<StatDto>>> GetAll()
    {
        var stats = await _db.Stats
            .OrderBy(s => s.Order)
            .Select(s => new StatDto
            {
                Id = s.Id,
                Label = s.Label,
                Value = s.Value,
                Order = s.Order
            })
            .ToListAsync();

        return Ok(stats);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StatDto>> GetById(int id)
    {
        var stat = await _db.Stats.FindAsync(id);
        if (stat == null)
        {
            return NotFound();
        }

        return Ok(new StatDto
        {
            Id = stat.Id,
            Label = stat.Label,
            Value = stat.Value,
            Order = stat.Order
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<StatDto>> Create([FromBody] StatDto dto)
    {
        var stat = new Stat
        {
            Label = dto.Label,
            Value = dto.Value,
            Order = dto.Order,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Stats.Add(stat);
        await _db.SaveChangesAsync();

        dto.Id = stat.Id;
        return CreatedAtAction(nameof(GetById), new { id = stat.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<StatDto>> Update(int id, [FromBody] StatDto dto)
    {
        var stat = await _db.Stats.FindAsync(id);
        if (stat == null)
        {
            return NotFound();
        }

        stat.Label = dto.Label;
        stat.Value = dto.Value;
        stat.Order = dto.Order;
        stat.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var stat = await _db.Stats.FindAsync(id);
        if (stat == null)
        {
            return NotFound();
        }

        _db.Stats.Remove(stat);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
