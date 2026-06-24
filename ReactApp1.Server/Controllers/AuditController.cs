using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Audit")]
    public class AuditController : ControllerBase
    {
        private readonly AuditService _auditService;

        public AuditController(AuditService auditService)
        {
            _auditService = auditService;
        }

        [HttpGet("GetAudit")]
        public ActionResult<List<Audit>> GetAudit()
        {
            return _auditService.GetAudits();
        }

        [HttpGet("GetAuditById/{id}")]
        public async Task<ActionResult<Audit>> GetAuditById(int id)
        {
            var audit = await _auditService.GetAuditByIdAsync(id); // using the service to fetch data

            if (audit == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return audit; // מחזירים את פרטי הארגון 
        }

        //[HttpPost("SaveAudit/{question}")]
        //public async Task<IActionResult> SaveQuestion([FromBody] Kindergarten kinder, [FromBody] Question question)
        //{
        //    if (question == null)
        //    {
        //        return BadRequest("Data is null.");
        //    }

        //    _questionService.SaveQuestion(question); // using the service to fetch data

        //    return Ok("Data saved successfully.");
        //}
    }
}
