using Microsoft.AspNetCore.Mvc;
using pro.Server.Services;
using ReactApp1.Server.Classes;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("User")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("GetUsers")]
        public ActionResult<List<User>> GetUsers()
        {
            return _userService.GetUsers();
        }

        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost("AddUser")]
        public async Task<ActionResult<User>> AddUser([FromBody] User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest("נתוני משתמש חסרים");
                }

                // ולידציות בסיסיות
                if (user.id <= 0)
                {
                    return BadRequest("מזהה משתמש חייב להיות מספר חיובי");
                }

                if (string.IsNullOrWhiteSpace(user.password))
                {
                    return BadRequest("סיסמה היא שדה חובה");
                }

                // בדיקה אם משתמש עם ID זה כבר קיים
                var existingUser = await _userService.GetUserByIdAsync(user.id);
                if (existingUser != null)
                {
                    return Conflict(new { message = "משתמש עם מזהה זה כבר קיים במערכת" });
                }

                var newUser = await _userService.AddUserAsync(user);
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
