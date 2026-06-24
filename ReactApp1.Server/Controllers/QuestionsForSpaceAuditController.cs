using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server.Classes;
using ReactApp1.Server.Services;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("QuestionsForSpaceAudit")]
    public class QuestionsForSpaceAuditController : ControllerBase
    {
        private readonly QuestionsForSpaceAuditService _questionsForSpaceAuditsService;

        public QuestionsForSpaceAuditController(QuestionsForSpaceAuditService questionsForSpaceAuditsService)
        {
            _questionsForSpaceAuditsService = questionsForSpaceAuditsService;
        }

        [HttpGet("GetActiveQuestionsForSpaceAudit")]
        public ActionResult<List<QuestionsForSpaceAudit>> GetQuestionsForSpaceAudit()
        {
            return _questionsForSpaceAuditsService.GetQuestionsForSpaceAudit();
        }

        [HttpGet("GetQuestionsForSpaceAuditById/{id}")]
        public async Task<ActionResult<QuestionsForSpaceAudit>> GetQuestionsForSpaceAuditById(int id)
        {
            var questionsForSpaceAudits = await _questionsForSpaceAuditsService.GetQuestionsForSpaceAuditByIdAsync(id); // using the service to fetch data

            if (questionsForSpaceAudits == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return questionsForSpaceAudits; // מחזירים את פרטי הארגון 
        }

    }
}
