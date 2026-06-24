using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server;

namespace pro.Server.Controllers
{
    [ApiController]
    [Route("Cities")]
    public class CityController : ControllerBase
    {
        private readonly CityService _cityService;
        private readonly ILogger<CityController> _logger;

        public CityController(CityService citiesService, ILogger<CityController> logger)
        {
            _cityService = citiesService;
            _logger = logger;
        }

        [HttpGet("GetCities")]
        public ActionResult<List<City>> GetCities()
        {
            return _cityService.GetCities();
        }


        [HttpGet("GetCityByCode/{id}")]
        public async Task<ActionResult<City>> GetCityByCode(int id)
        {
            var city = await _cityService.GetCityByIdAsync(id);

            if (city == null)
            {
                return NotFound();
            }

            return city;
        }

        [HttpPost("AddCity")]
        public async Task<ActionResult<City>> AddCity([FromBody] City city)
        {
            try
            {
                _logger.LogInformation($"Received request to add city: {city?.name}");
                
                if (city == null)
                {
                    _logger.LogWarning("City object is null");
                    return BadRequest("נתוני עיר חסרים");
                }

                if (string.IsNullOrWhiteSpace(city.name))
                {
                    _logger.LogWarning("City name is empty");
                    return BadRequest("שם העיר הוא שדה חובה");
                }

                // בדיקה אם עיר עם שם זהה כבר קיימת
                var existingCity = await _cityService.GetCityByNameAsync(city.name);
                if (existingCity != null)
                {
                    _logger.LogWarning($"City with name '{city.name}' already exists");
                    return Conflict(new { message = "עיר עם שם זה כבר קיימת במערכת" });
                }

                var addedCity = await _cityService.AddCityAsync(city);
                _logger.LogInformation($"City '{addedCity.name}' added successfully with code {addedCity.cityCode}");
                
                return CreatedAtAction(nameof(GetCityByCode), new { id = addedCity.cityCode }, addedCity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding city: {ex.Message}");
                return StatusCode(500, new { message = $"שגיאה בהוספת עיר: {ex.Message}" });
            }
        }

        [HttpPost("UpdateCity")]
        public async Task<IActionResult> UpdateCity([FromBody] City updatedCity)
        {
            try
            {
                _logger.LogInformation($"Received request to update city: {updatedCity?.cityCode}");
                
                if (updatedCity == null)
                {
                    _logger.LogWarning("City object is null");
                    return BadRequest("נתוני עיר חסרים");
                }

                var updated = await _cityService.UpdateCityAsync(updatedCity.cityCode, updatedCity);
                
                if (updated == null)
                {
                    _logger.LogWarning($"City with code {updatedCity.cityCode} not found");
                    return NotFound("עיר לא נמצאה");
                }

                _logger.LogInformation($"City '{updated.name}' updated successfully");
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating city: {ex.Message}");
                return StatusCode(500, new { message = $"שגיאה בעדכון עיר: {ex.Message}" });
            }
        }
    }
}


