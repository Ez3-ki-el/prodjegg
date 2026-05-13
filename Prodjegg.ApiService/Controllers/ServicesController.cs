using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly AppDb _db;

    public ServicesController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<ServiceDto>>> GetAll()
    {
        var services = await _db.Services
            .OrderBy(s => s.Order)
            .Select(s => new ServiceDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                IconClass = s.IconClass,
                Order = s.Order
            })
            .ToListAsync();

        return Ok(services);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(int id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound();
        }

        return Ok(new ServiceDto
        {
            Id = service.Id,
            Title = service.Title,
            Description = service.Description,
            IconClass = service.IconClass,
            Order = service.Order
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create([FromBody] ServiceDto dto)
    {
        var service = new Service
        {
            Title = dto.Title,
            Description = dto.Description,
            IconClass = dto.IconClass,
            Order = dto.Order,
            CreatedAt = DateTime.UtcNow
        };

        _db.Services.Add(service);
        await _db.SaveChangesAsync();

        dto.Id = service.Id;
        return CreatedAtAction(nameof(GetById), new { id = service.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceDto>> Update(int id, [FromBody] ServiceDto dto)
    {
        var service = await _db.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound();
        }

        service.Title = dto.Title;
        service.Description = dto.Description;
        service.IconClass = dto.IconClass;
        service.Order = dto.Order;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var service = await _db.Services.FindAsync(id);
        if (service == null)
        {
            return NotFound();
        }

        _db.Services.Remove(service);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
