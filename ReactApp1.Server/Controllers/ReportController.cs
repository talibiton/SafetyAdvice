using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Services;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly ReportService _reportService;
        private readonly ILogger<ReportController> _logger;

        public ReportController(ReportService reportService, ILogger<ReportController> logger)
        {
            _reportService = reportService;
            _logger = logger;
        }

        [HttpGet("counselors")]
        public async Task<IActionResult> GetAllCounselors()
        {
            _logger.LogInformation("GetAllCounselors endpoint hit at {Time}", DateTime.Now);
            try
            {
                _logger.LogInformation("Calling ReportService.GetAllCounselorsAsync");
                var result = await _reportService.GetAllCounselorsAsync();
                _logger.LogInformation($"Found {result.Count} counselors");
                
                if (result == null || result.Count == 0)
                {
                    _logger.LogWarning("No counselors found in database");
                    return Ok(new List<object>());
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllCounselors: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת רשימת היועצים", error = ex.Message, stackTrace = ex.StackTrace });
            }
        }

        [HttpGet("audited-by-counselor")]
        public async Task<IActionResult> GetAuditedByCounselorToday([FromQuery] string counselorId, [FromQuery] string date)
        {
            try
            {
                if (string.IsNullOrEmpty(counselorId))
                {
                    return BadRequest(new { message = "חובה לבחור יועץ" });
                }

                if (string.IsNullOrEmpty(date))
                {
                    return BadRequest(new { message = "חובה לבחור תאריך" });
                }

                if (!DateTime.TryParse(date, out DateTime selectedDate))
                {
                    return BadRequest(new { message = "תאריך לא תקין" });
                }

                var result = await _reportService.GetKindergartensAuditedByCounselorOnDateAsync(counselorId, selectedDate);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "שגיאה בשליפת הנתונים", error = ex.Message });
            }
        }

        [HttpGet("closed-immediately")]
        public async Task<IActionResult> GetClosedImmediately([FromQuery] int? year)
        {
            try
            {
                var result = await _reportService.GetKindergartensClosedImmediatelyAsync(year);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetClosedImmediately: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת הדוח", error = ex.Message });
            }
        }

        [HttpGet("need-repairs")]
        public async Task<IActionResult> GetNeedRepairs([FromQuery] int? year)
        {
            try
            {
                var result = await _reportService.GetKindergartensNeedRepairsAsync(year);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetNeedRepairs: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת הדוח", error = ex.Message });
            }
        }

        [HttpGet("approved-immediately")]
        public async Task<IActionResult> GetApprovedImmediately([FromQuery] int? year)
        {
            try
            {
                var result = await _reportService.GetKindergartensApprovedImmediatelyAsync(year);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetApprovedImmediately: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת הדוח", error = ex.Message });
            }
        }

        [HttpGet("not-audited")]
        public async Task<IActionResult> GetNotAuditedYet()
        {
            try
            {
                var result = await _reportService.GetKindergartensNotAuditedYetAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetNotAuditedYet: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת הדוח", error = ex.Message });
            }
        }

        [HttpGet("address-changed")]
        public async Task<IActionResult> GetAddressChanged()
        {
            try
            {
                var result = await _reportService.GetKindergartensWithAddressChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAddressChanged: {Message}", ex.Message);
                return StatusCode(500, new { message = "שגיאה בטעינת הדוח", error = ex.Message });
            }
        }
    }
}
