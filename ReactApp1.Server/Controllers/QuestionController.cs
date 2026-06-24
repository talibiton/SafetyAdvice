using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;
using pro.Server.Services;
using System;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Question")]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _questionService;

        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet("GetActiveQuestions")]
        public ActionResult<List<Question>> GetActiveQuestions()
        {
            return _questionService.GetActiveQuestions();
        }

        [HttpGet("GetAllQuestions")]
        public ActionResult<List<Question>> GetAllQuestions()
        {
            return _questionService.GetAllQuestions();
        }

        [HttpGet("GetQuestionById/{id}")]
        public async Task<ActionResult<Question>> GetQuestionById(int id)
        {
            var question = await _questionService.GetQuestionByIdAsync(id); // using the service to fetch data

            if (question == null)
            {
                return NotFound(); // אם לא נמצא מחזירים 404
            }

            return question; // מחזירים את פרטי הארגון 
        }

        [HttpPost("UpdateQuestion")]
        public async Task<IActionResult> UpdateQuestion([FromBody] Question updatedQuestion)
        {
            var updated = await _questionService.UpdateQuestionAsync(updatedQuestion.id, updatedQuestion);
            if (updated == null) return NotFound("שאלה לא נמצאה");

            return Ok(updated);
        }
    }
}
