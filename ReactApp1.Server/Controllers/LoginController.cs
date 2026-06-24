using Microsoft.AspNetCore.Mvc;
using pro.Server.Models;
using ReactApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("login")]
    public class LoginController : ControllerBase
    {
        private readonly SafetyAdviceDB _context;
        private readonly ILogger<LoginController> _logger;

        public LoginController(SafetyAdviceDB context, ILogger<LoginController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost()]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            try
            {
                string userIdStr = loginModel.UserId;
                string password = loginModel.Password;

                _logger.LogInformation($"ניסיון התחברות עבור משתמש: {userIdStr}");

                // המרה ל-int
                if (!int.TryParse(userIdStr, out int userId))
                {
                    return BadRequest(new { message = "מזהה משתמש לא תקין" });
                }

                // בדיקה ראשונה: חיפוש בטבלת Users
                var user = await _context.Users.FirstOrDefaultAsync(u => u.id == userId);
                
                if (user != null)
                {
                    _logger.LogInformation($"משתמש נמצא: {user.id}");
                    
                    // אם נמצא המשתמש, בדיקת הסיסמה
                    if (user.password == password)
                    {
                        var token = "user-token-" + userId;
                        return Ok(new 
                        { 
                            token,
                            userType = "User",
                            userId = user.id.ToString(),
                            kindAuth = user.kind_auth
                        });
                    }
                    else
                    {
                        _logger.LogWarning($"סיסמה שגויה עבור משתמש: {userId}");
                        return Unauthorized(new { message = "סיסמה שגויה" });
                    }
                }
                else
                {
                    _logger.LogInformation($"משתמש לא נמצא בטבלת Users: {userId}");
                }

                // בדיקה שנייה: חיפוש בטבלת Counselors
                var counselor = await _context.Counselors.FirstOrDefaultAsync(c => c.id == userIdStr);
                
                if (counselor != null)
                {
                    _logger.LogInformation($"יועץ נמצא: {counselor.id}");
                    
                    // אם נמצא היועץ, בדיקת הסיסמה
                    if (counselor.password == password)
                    {
                        var token = "counselor-token-" + userIdStr;
                        return Ok(new 
                        { 
                            token,
                            userType = "Counselor",
                            userId = counselor.id,
                            firstName = counselor.firstName,
                            lastName = counselor.lastName,
                            email = counselor.email
                        });
                    }
                    else
                    {
                        _logger.LogWarning($"סיסמה שגויה עבור יועץ: {userIdStr}");
                        return Unauthorized(new { message = "סיסמה שגויה" });
                    }
                }
                else
                {
                    _logger.LogInformation($"יועץ לא נמצא בטבלת Counselors: {userIdStr}");
                }

                // אם לא נמצא לא בטבלת Users ולא בטבלת Counselors
                _logger.LogWarning($"משתמש/יועץ לא נמצא במערכת: {userIdStr}");
                return NotFound(new { message = "המשתמש לא נמצא במערכת" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"שגיאה בתהליך התחברות: {ex.Message}");
                return StatusCode(500, new { message = "שגיאה בתהליך התחברות", error = ex.Message });
            }
        }
    }
}
