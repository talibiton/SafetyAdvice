using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Hub")]
    public class HubController : ControllerBase
    {
        private readonly HubService _hubService;
        private readonly ILogger<HubController> _logger;

        public HubController(HubService hubService, ILogger<HubController> logger)
        {
            _hubService = hubService;
            _logger = logger;
        }

        [HttpGet("GetHubs")]
        public ActionResult<List<Hub>> GetHubs()
        {
            return _hubService.GetHubs();
        }

        [HttpGet("GetHubById/{id}")]
        public async Task<ActionResult<Hub>> GetHubById(string id)
        {
            var hub = await _hubService.GetHubByIdAsync(id); // using the service to fetch data

            if (hub == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return hub; // מחזירים את פרטי הארגון 
        }


        [HttpGet("GetHubByOrganization/{organizationId}")]
        public async Task<List<Hub>> GetHubByOrganizationAsync(string organizationId)
        {
           //  var hub = await _hubService.GetHubByOrganizationIdAsync("112");
             return await _hubService.GetHubByOrganizationIdAsync(organizationId);
        }

        [HttpPut("UpdateHub")]
        [HttpPost("UpdateHub")] // תמיכה גם ב-POST לתאימות לאחור
        public async Task<IActionResult> UpdateHub([FromBody] Hub updatedHub)
        {
            try
            {
                _logger.LogInformation($"UpdateHub called with data: {System.Text.Json.JsonSerializer.Serialize(updatedHub)}");

                if (updatedHub == null)
                {
                    _logger.LogWarning("UpdateHub: updatedHub is null");
                    return BadRequest(new { message = "נתוני רכזת חסרים" });
                }

                if (string.IsNullOrWhiteSpace(updatedHub.id))
                {
                    _logger.LogWarning("UpdateHub: id is null or empty");
                    return BadRequest(new { message = "מזהה רכזת חסר" });
                }

                if (string.IsNullOrWhiteSpace(updatedHub.firstName))
                {
                    _logger.LogWarning("UpdateHub: firstName is null or empty");
                    return BadRequest(new { message = "שם פרטי חסר" });
                }

                if (string.IsNullOrWhiteSpace(updatedHub.lastName))
                {
                    _logger.LogWarning("UpdateHub: lastName is null or empty");
                    return BadRequest(new { message = "שם משפחה חסר" });
                }

                var updated = await _hubService.UpdateHubAsync(updatedHub.id, updatedHub);
                
                if (updated == null)
                {
                    _logger.LogWarning($"UpdateHub: Hub with id {updatedHub.id} not found");
                    return NotFound(new { message = "רכזת לא נמצאת" });
                }

                _logger.LogInformation($"Hub {updatedHub.id} updated successfully");
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating hub: {ex.Message}");
                return StatusCode(500, new { message = $"שגיאה בעדכון רכזת: {ex.Message}" });
            }
        }
    }
}
