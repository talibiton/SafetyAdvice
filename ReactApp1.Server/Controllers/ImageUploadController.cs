using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        private readonly string _uploadFolder;

        public ImageUploadController()
        {
            // תיקייה לשמירת תמונות
            _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "audit-images");
            
            // יצירת התיקייה אם היא לא קיימת
            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded");
                }

                // בדיקת סוג הקובץ
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!Array.Exists(allowedExtensions, ext => ext == extension))
                {
                    return BadRequest("Invalid file type. Only images are allowed.");
                }

                // בדיקת גודל הקובץ (מקסימום 5MB)
                if (file.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size exceeds 5MB limit");
                }

                // יצירת שם קובץ ייחודי
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(_uploadFolder, fileName);

                // שמירת הקובץ
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // החזרת כתובת URL של התמונה
                var imageUrl = $"/uploads/audit-images/{fileName}";
                return Ok(new { url = imageUrl, fileName = fileName });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading image: {ex.Message}");
                return StatusCode(500, "Error uploading image");
            }
        }

        [HttpDelete("delete/{fileName}")]
        public IActionResult DeleteImage(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_uploadFolder, fileName);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { message = "Image deleted successfully" });
                }
                
                return NotFound("Image not found");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                return StatusCode(500, "Error deleting image");
            }
        }
    }
}
