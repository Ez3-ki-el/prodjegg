using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prodjegg.ApiService.DTOs;
using Prodjegg.Data.Db;
using Prodjegg.Data.Models;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly AppDb _db;

    public TestimonialsController(AppDb db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<TestimonialDto>>> GetAll()
    {
        var testimonials = await _db.Testimonials
            .OrderBy(t => t.Order)
            .Select(t => new TestimonialDto
            {
                Id = t.Id,
                ClientName = t.ClientName,
                ClientTitle = t.ClientTitle,
                ClientImagePath = t.ClientImagePath,
                Content = t.Content,
                Rating = t.Rating,
                Order = t.Order
            })
            .ToListAsync();

        return Ok(testimonials);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TestimonialDto>> GetById(int id)
    {
        var testimonial = await _db.Testimonials.FindAsync(id);
        if (testimonial == null)
        {
            return NotFound();
        }

        return Ok(new TestimonialDto
        {
            Id = testimonial.Id,
            ClientName = testimonial.ClientName,
            ClientTitle = testimonial.ClientTitle,
            ClientImagePath = testimonial.ClientImagePath,
            Content = testimonial.Content,
            Rating = testimonial.Rating,
            Order = testimonial.Order
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TestimonialDto>> Create([FromBody] TestimonialDto dto)
    {
        var testimonial = new Testimonial
        {
            ClientName = dto.ClientName,
            ClientTitle = dto.ClientTitle,
            ClientImagePath = dto.ClientImagePath,
            Content = dto.Content,
            Rating = dto.Rating,
            Order = dto.Order,
            CreatedAt = DateTime.UtcNow
        };

        _db.Testimonials.Add(testimonial);
        await _db.SaveChangesAsync();

        dto.Id = testimonial.Id;
        return CreatedAtAction(nameof(GetById), new { id = testimonial.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<TestimonialDto>> Update(int id, [FromBody] TestimonialDto dto)
    {
        var testimonial = await _db.Testimonials.FindAsync(id);
        if (testimonial == null)
        {
            return NotFound();
        }

        testimonial.ClientName = dto.ClientName;
        testimonial.ClientTitle = dto.ClientTitle;
        testimonial.ClientImagePath = dto.ClientImagePath;
        testimonial.Content = dto.Content;
        testimonial.Rating = dto.Rating;
        testimonial.Order = dto.Order;

        await _db.SaveChangesAsync();

        return Ok(dto);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var testimonial = await _db.Testimonials.FindAsync(id);
        if (testimonial == null)
        {
            return NotFound();
        }

        _db.Testimonials.Remove(testimonial);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
