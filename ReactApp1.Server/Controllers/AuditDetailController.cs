using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server.Classes;
using ReactApp1.Server.Models;

namespace pro.Server.Controllers
{
    [Route("AuditDetail")]
    [ApiController]
    public class AuditDetailController : ControllerBase
    {
        private readonly AuditDetailService _auditDetailService;

        public AuditDetailController(AuditDetailService auditService)
        {
            _auditDetailService = auditService;
        }

        [HttpGet("GetAuditDetailByCounselors/{CounselorsId}")]
        public async Task<IActionResult> GetAuditDetailByCounselors(string CounselorsId)
        {
            var audits = await _auditDetailService.GetAuditDetailByCounselorId(CounselorsId);
            return Ok(audits);
        }

        [HttpGet("GetAuditDetailsWithFilters")]
        public async Task<IActionResult> GetAuditDetailsWithFilters(
            [FromQuery] string? counselorId = null,
            [FromQuery] string? organizationId = null,
            [FromQuery] int? cityCode = null,
            [FromQuery] string? hubId = null,
            [FromQuery] string? nannyId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? searchText = null,
            [FromQuery] int? approvalStatus = null)
        {
            var audits = await _auditDetailService.GetAuditDetailsWithFilters(
                counselorId, organizationId, cityCode, hubId, nannyId, fromDate, toDate, searchText, approvalStatus);
            return Ok(audits);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuditDetailById(int id)
        {
            var audit = await _auditDetailService.GetAuditDetailById(id);
            if (audit == null)
            {
                return NotFound();
            }
            return Ok(audit);
        }

        [HttpGet("GetQuestionsWithAnswers/{auditId}")]
        public async Task<IActionResult> GetQuestionsWithAnswers(int auditId)
        {
            var questions = await _auditDetailService.GetQuestionsWithAnswersByAuditId(auditId);
            return Ok(questions);
        }

        [HttpGet("GetFullAuditWithQuestions/{auditId}")]
        public async Task<IActionResult> GetFullAuditWithQuestions(int auditId)
        {
            try
            {
                var result = await _auditDetailService.GetFullAuditWithQuestionsById(auditId);
                if (result == null)
                    return NotFound();

                Console.WriteLine($"Returning audit with {result.questions?.Count ?? 0} questions");
                var questions = result.questions ?? new List<QuestionWithAnswerViewModel>();
                foreach (var q in questions)
                {
                    Console.WriteLine($"Question {q.questionId}: Answer='{q.answer}', AnswerOptions=[{string.Join(", ", q.answerOptions?.Select(o => $"{o.id}:{o.option}") ?? Array.Empty<string>())}]");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetFullAuditWithQuestions: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("UpdateAudit/{auditId}")] // שינוי הנתיב ל-UpdateAudit/ על מנת להתאים לקריאה מה-React
        public async Task<IActionResult> UpdateAudit(int auditId, [FromBody] UpdateAuditQuestionsRequest request)
        {
            try
            {
                Console.WriteLine($"Received update request for audit {auditId}");

                if (request == null || request.questions == null)
                {
                    Console.WriteLine("Request or questions list is null");
                    return BadRequest("Questions list cannot be null");
                }

                Console.WriteLine($"Received {request.questions.Count} questions to update");
                Console.WriteLine($"Audit type to update: {request.type}");
                Console.WriteLine($"Approval status to update: {request.approvalStatus}");
                
                foreach (var q in request.questions)
                {
                    Console.WriteLine($"Question {q.questionId}: Type={q.questionType}, Answer='{q.answer}'");
                }

                // יצירת ViewModel עם audit ריק (לא צריך לעדכן את ה-audit עצמו)
                var model = new FullAuditWithQuestionsViewModel
                {
                    audit = null, // לא צריך לעדכן את ה-audit
                    questions = request.questions
                };

                // עדכון השאלות
                var success = await _auditDetailService.UpdateFullAuditWithQuestions(auditId, model);

                // עדכון סוג המבדק אם צוין
                if (success && request.type.HasValue)
                {
                    success = await _auditDetailService.UpdateAuditType(auditId, request.type.Value);
                }

                // עדכון סטטוס אישור אם צוין
                if (success && request.approvalStatus.HasValue)
                {
                    success = await _auditDetailService.UpdateAuditApprovalStatus(auditId, request.approvalStatus.Value);
                }

                if (success)
                {
                    Console.WriteLine("Update successful");
                    return Ok(new { message = "Audit updated successfully" });
                }
                else
                {
                    Console.WriteLine("Update failed in service");
                    return StatusCode(500, "Failed to update audit or audit not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateAudit: {ex.Message}\n{ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateApprovalStatus/{auditId}")]
        public async Task<IActionResult> UpdateApprovalStatus(int auditId, [FromBody] UpdateApprovalStatusRequest request)
        {
            try
            {
                Console.WriteLine($"Received approval status update for audit {auditId}: {request.approvalStatus}");

                var success = await _auditDetailService.UpdateAuditApprovalStatus(auditId, request.approvalStatus);

                if (success)
                {
                    Console.WriteLine("Approval status updated successfully");
                    return Ok(new { message = "Approval status updated successfully" });
                }
                else
                {
                    Console.WriteLine("Update failed in service");
                    return StatusCode(500, "Failed to update approval status or audit not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateApprovalStatus: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // הוספת מודל חדש לבקשת עדכון
        public class UpdateAuditQuestionsRequest
        {
            public List<QuestionWithAnswerViewModel> questions { get; set; }
            public int? type { get; set; } // סוג המבדק
            public int? approvalStatus { get; set; } // סטטוס אישור
        }

        public class UpdateApprovalStatusRequest
        {
            public int approvalStatus { get; set; }
        }
    }
}
