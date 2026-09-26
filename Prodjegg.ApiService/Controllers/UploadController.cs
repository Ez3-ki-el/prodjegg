using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Prodjegg.ApiService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("image")]
    public async Task<ActionResult<string>> UploadImage([FromForm] IFormFile file, [FromQuery] string folder = "general")
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest("Invalid file type. Only images are allowed.");
        }

        var uploadsRoot = GetUploadsRoot();
        var uploadsFolder = Path.GetFullPath(Path.Combine(uploadsRoot, folder));

        if (!IsWithinUploadsRoot(uploadsFolder, uploadsRoot))
        {
            return BadRequest("Invalid folder");
        }

        Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = $"/uploads/{folder}/{uniqueFileName}";
        return Ok(new { path = relativePath });
    }

    [HttpDelete("image")]
    public ActionResult DeleteImage([FromQuery] string path)
    {
        if (string.IsNullOrEmpty(path))
        {
            return BadRequest("Path is required");
        }

        var uploadsRoot = GetUploadsRoot();
        var filePath = Path.GetFullPath(Path.Combine(_environment.WebRootPath, path.TrimStart('/', '\\')));

        if (!IsWithinUploadsRoot(filePath, uploadsRoot))
        {
            return BadRequest("Invalid path");
        }

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
            return Ok(new { message = "File deleted successfully" });
        }

        return NotFound("File not found");
    }

    // Résout /wwwroot/uploads une seule fois, avec un séparateur final pour que le
    // contrôle StartsWith ci-dessous ne matche pas un dossier voisin (ex: "uploads-evil").
    private string GetUploadsRoot() =>
        Path.GetFullPath(Path.Combine(_environment.WebRootPath, "uploads") + Path.DirectorySeparatorChar);

    // Empêche un ".." ou un chemin absolu dans `folder`/`path` de sortir de wwwroot/uploads.
    private static bool IsWithinUploadsRoot(string resolvedPath, string uploadsRoot) =>
        resolvedPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase);
}
