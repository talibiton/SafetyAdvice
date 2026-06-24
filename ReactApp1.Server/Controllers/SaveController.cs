using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server.Classes;
using ReactApp1.Server.Models;
using ReactApp1.Server.Services;
using System.Net;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("Save")]
    public class SaveController : Controller
    {
        private readonly SaveService _saveService;

        public SaveController(SaveService saveService)
        {
            _saveService = saveService;
        }

        [HttpPost("Save")]
        public async Task<IActionResult> Save([FromBody] SaveData data)
        {
            if (data == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                await _saveService.AddInspectionAsync(data);
                return Ok("Data saved successfully.");
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("SaveAdress")]
        public async Task<IActionResult> SaveAdress([FromBody] Adreess data)
        {
            if (data == null)
                return BadRequest("Address data is null");

            try
            {
                await _saveService.SaveAdressAsync(data);
                return Ok("Address saved successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("AddQuestion")]
        public async Task<IActionResult> AddQuestion([FromBody] Question data)
        {
            if (data == null)
            {
                Console.WriteLine("Received null data");
                return BadRequest("Question data is null");
            }

            Console.WriteLine($"Received question: {data.question}, Type: {data.type}, Options: {data.options?.Count}");

            try
            {
                await _saveService.AddQuestionAsync(data);
                return Ok("Data saved successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

        [HttpPost("AddQuestionForSpace")]
        public async Task<IActionResult> AddQuestionForSpace([FromBody] QuestionsForSpace data)
        {
            if (data == null)
            {
                                Console.WriteLine("Received null data");
                return BadRequest("Question data is null");

            }
                        Console.WriteLine($"Received question: {data.question}, Type: {data.type}, Options: {data.options?.Count}");

            try
            {
                await _saveService.AddQuestionForSpaceAsync(data);
                return Ok("Data saved successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }

    }
}

