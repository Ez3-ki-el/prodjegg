using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly AppDb _db;

    public SkillsController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SkillDto>>> GetAll()
    {
        var skills = await _db.Skills
            .OrderBy(s => s.Order)
            .Select(s => new SkillDto
            {
                Id = s.Id,
                Name = s.Name,
                Percentage = s.Percentage,
                Order = s.Order
            })
            .ToListAsync();

        return Ok(skills);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SkillDto>> GetById(int id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill == null)
        {
            return NotFound();
        }

        return Ok(new SkillDto
        {
            Id = skill.Id,
            Name = skill.Name,
            Percentage = skill.Percentage,
            Order = skill.Order
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<SkillDto>> Create([FromBody] SkillDto dto)
    {
        var skill = new Skill
        {
            Name = dto.Name,
            Percentage = dto.Percentage,
            Order = dto.Order,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();

        dto.Id = skill.Id;
        return CreatedAtAction(nameof(GetById), new { id = skill.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<SkillDto>> Update(int id, [FromBody] SkillDto dto)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill == null)
        {
            return NotFound();
        }

        skill.Name = dto.Name;
        skill.Percentage = dto.Percentage;
        skill.Order = dto.Order;
        skill.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var skill = await _db.Skills.FindAsync(id);
        if (skill == null)
        {
            return NotFound();
        }

        _db.Skills.Remove(skill);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
