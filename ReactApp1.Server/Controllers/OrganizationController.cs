using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Models;
using pro.Server.Services;
using ReactApp1.Server.Models;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Organization")]
    public class OrganizationController : ControllerBase
    {
        private readonly OrganizationService _organizationService;

        public OrganizationController(OrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        [HttpGet("GetOrganizations")]
        public ActionResult<List<Organization>> GetOrganizations()
        {
            return _organizationService.GetOrganizations();
        }

        [HttpGet("GetOrganizationById/{id}")]
        public async Task<ActionResult<Organization>> GetOrganizationById(string id)
        {
            var organization = await _organizationService.GetOrganizationByIdAsync(id); // using the service to fetch data

            if (organization == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return organization; // מחזירים את פרטי הארגון 
        }

        [HttpPost("AddOrganization")]
        public async Task<ActionResult<Organization>> AddOrganization([FromBody] AddOrganizationRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest("נתוני ארגון חסרים");
                }

                if (string.IsNullOrWhiteSpace(request.name))
                {
                    return BadRequest("שם הארגון הוא שדה חובה");
                }

                if (string.IsNullOrWhiteSpace(request.email))
                {
                    return BadRequest("אימייל הארגון הוא שדה חובה");
                }

                // בדיקה אם ארגון עם שם זהה כבר קיים
                var existingOrganization = await _organizationService.GetOrganizationByNameAsync(request.name);
                if (existingOrganization != null)
                {
                    return Conflict(new { message = "ארגון עם שם זה כבר קיים במערכת" });
                }

                var organization = new Organization
                {
                    name = request.name,
                    email = request.email
                };

                var newOrganization = await _organizationService.AddOrganizationAsync(organization);
                return Ok(newOrganization);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}


