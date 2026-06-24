using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Counselor")]
    public class CounselorController : ControllerBase
    {
        private readonly CounselorService _counselorService;

        public CounselorController(CounselorService counselorService)
        {
            _counselorService = counselorService;
        }

        [HttpGet("GetCounselors")]
        public ActionResult<List<Counselor>> GetCounselors()
        {
            return _counselorService.GetCounselors();
        }

        [HttpGet("GetCounselorById/{id}")]
        public async Task<ActionResult<Counselor>> GetCounselorById(string id)
        {
            var counselor = await _counselorService.GetCounselorByIdAsync(id); // using the service to fetch data

            if (counselor == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return counselor; // מחזירים את פרטי הארגון 
        }

        [HttpPost("AddCounselor")]
        public async Task<ActionResult<Counselor>> AddCounselor([FromBody] Counselor counselor)
        {
            try
            {
                if (counselor == null)
                {
                    return BadRequest("נתוני יועץ חסרים");
                }

                // ולידציות בסיסיות
                if (string.IsNullOrWhiteSpace(counselor.id) || counselor.id.Length != 9)
                {
                    return BadRequest("מספר תעודת זהות חייב להיות 9 תווים");
                }

                if (string.IsNullOrWhiteSpace(counselor.firstName))
                {
                    return BadRequest("שם פרטי הוא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(counselor.lastName))
                {
                    return BadRequest("שם משפחה הוא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(counselor.email))
                {
                    return BadRequest("אימייל הוא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(counselor.password))
                {
                    return BadRequest("סיסמה היא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(counselor.documentary))
                {
                    return BadRequest("תיעוד הוא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(counselor.signature))
                {
                    return BadRequest("חתימה היא שדה חובה");
                }

                // בדיקה אם יועץ עם תעודת זהות זו כבר קיים
                var existingCounselor = await _counselorService.GetCounselorByIdAsync(counselor.id);
                if (existingCounselor != null)
                {
                    return Conflict(new { message = "יועץ עם תעודת זהות זו כבר קיים במערכת" });
                }

                var addedCounselor = await _counselorService.AddCounselorAsync(counselor);
                return CreatedAtAction(nameof(GetCounselorById), new { id = addedCounselor.id }, addedCounselor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"שגיאה בהוספת יועץ: {ex.Message}" });
            }
        }

        [HttpPost("UpdateCounselor")]
        public async Task<IActionResult> UpdateCounselor([FromBody] Counselor updatedCounselor)
        {
            try
            {
                if (updatedCounselor == null)
                {
                    return BadRequest("נתוני יועץ חסרים");
                }

                if (string.IsNullOrWhiteSpace(updatedCounselor.id))
                {
                    return BadRequest("מזהה יועץ חסר");
                }

                var updated = await _counselorService.UpdateCounselorAsync(updatedCounselor.id, updatedCounselor);
                
                if (updated == null)
                {
                    return NotFound("יועץ לא נמצא");
                }

                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"שגיאה בעדכון יועץ: {ex.Message}" });
            }
        }
    }
}
