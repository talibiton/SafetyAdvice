using Microsoft.AspNetCore.Mvc;
using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server.Classes;
using ReactApp1.Server.Services;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("QuestionsForSpace")]
    public class QuestionsForSpaceController : ControllerBase
    {
        private readonly QuestionsForSpaceService _questionsForSpaceService;

        public QuestionsForSpaceController(QuestionsForSpaceService questionsForSpaceService)
        {
            _questionsForSpaceService = questionsForSpaceService;
        }

        [HttpGet("GetActiveQuestionsForSpace")]
        public ActionResult<List<QuestionsForSpace>> GetActiveQuestionsForSpace()
        {
            return _questionsForSpaceService.GetActiveQuestionsForSpace();
        }

        [HttpGet("GetAllQuestions")]
        public ActionResult<List<QuestionsForSpace>> GetAllQuestionsForSpace()
        {
            return _questionsForSpaceService.GetAllQuestionsForSpace();
        }

        [HttpGet("GetQuestionForSpaceById/{id}")]
        public async Task<ActionResult<QuestionsForSpace>> GetQuestionForSpaceById(int id)
        {
            var question = await _questionsForSpaceService.GetQuestionForSpaceByIdAsync(id); // using the service to fetch data

            if (question == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return question; // מחזירים את פרטי הארגון 
        }

        [HttpPost("UpdateQuestion")]
        public async Task<IActionResult> UpdateQuestion([FromBody] QuestionsForSpace updatedQuestion)
        {
            var updated = await _questionsForSpaceService.UpdateQuestionAsync(updatedQuestion.id, updatedQuestion);
            if (updated == null) return NotFound("שאלה לא נמצאה");

            return Ok(updated);
        }
    }
}
