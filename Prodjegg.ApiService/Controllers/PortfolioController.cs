using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;
using Prodjegg.ApiService.Helpers;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly AppDb _db;

    public PortfolioController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<PortfolioItemDto>>> GetAll([FromQuery] string? category = null)
    {
        var query = _db.PortfolioItems.AsQueryable();

        if (!string.IsNullOrEmpty(category) && category != "ALL")
        {
            query = query.Where(p => p.Category == category);
        }

        var items = await query
            .OrderBy(p => p.Order)
            .Select(p => new PortfolioItemDto
            {
                Id = p.Id,
                Title = p.Title,
                ImagePath = p.ImagePath,
                Category = p.Category,
                ProjectUrl = UrlHelper.NormalizeExternalUrl(p.ProjectUrl),
                Order = p.Order
            })
            .ToListAsync();
        
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PortfolioItemDto>> GetById(int id)
    {
        var item = await _db.PortfolioItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        return Ok(new PortfolioItemDto
        {
            Id = item.Id,
            Title = item.Title,
            ImagePath = item.ImagePath,
            Category = item.Category,
            ProjectUrl = UrlHelper.NormalizeExternalUrl(item.ProjectUrl),
            Order = item.Order
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PortfolioItemDto>> Create([FromBody] PortfolioItemDto dto)
    {
        var item = new PortfolioItem
        {
            Title = dto.Title,
            ImagePath = dto.ImagePath,
            Category = dto.Category,
            ProjectUrl = UrlHelper.NormalizeExternalUrl(dto.ProjectUrl),
            Order = dto.Order,
            CreatedAt = DateTime.UtcNow
        };

        _db.PortfolioItems.Add(item);
        await _db.SaveChangesAsync();

        dto.Id = item.Id;
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<PortfolioItemDto>> Update(int id, [FromBody] PortfolioItemDto dto)
    {
        var item = await _db.PortfolioItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        item.Title = dto.Title;
        item.ImagePath = dto.ImagePath;
        item.Category = dto.Category;
        item.ProjectUrl = UrlHelper.NormalizeExternalUrl(dto.ProjectUrl);
        item.Order = dto.Order;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var item = await _db.PortfolioItems.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }

        _db.PortfolioItems.Remove(item);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
