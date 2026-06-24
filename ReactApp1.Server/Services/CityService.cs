using pro.Server.Models;
using pro.Server.Classes;
using Microsoft.EntityFrameworkCore;

namespace pro.Server.Services
{
    public class CityService
    {
        private readonly SafetyAdviceDB _context;

        public CityService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<City> GetCities()
        {
            return _context.Cities.ToList();
        }

        public async Task<City> GetCityByIdAsync(int cityCode)
        {
            return await _context.Cities.FirstOrDefaultAsync(c => c.cityCode == cityCode);
        }

        public async Task<City> GetCityByNameAsync(string name)
        {
            return await _context.Cities.FirstOrDefaultAsync(c => c.name.ToLower() == name.ToLower());
        }

        public async Task<City> AddCityAsync(City city)
        {
            try
            {
                Console.WriteLine($"Attempting to add city: {city.name}, Active: {city.active}");

                _context.Cities.Add(city);
                await _context.SaveChangesAsync();

                Console.WriteLine($"City added successfully with cityCode: {city.cityCode}");
                return city;
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"Database error adding city: {dbEx.Message}");
                if (dbEx.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {dbEx.InnerException.Message}");
                }
                throw new Exception($"שגיאה בשמירת העיר במסד הנתונים: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding city: {ex.Message}");
                throw;
            }
        }

        public async Task<City> UpdateCityAsync(int cityCode, City updatedCity)
        {
            try
            {
                Console.WriteLine($"Attempting to update city with cityCode: {cityCode}, Active: {updatedCity.active}");

                var existingCity = await _context.Cities.FirstOrDefaultAsync(c => c.cityCode == cityCode);
                
                if (existingCity == null)
                {
                    Console.WriteLine($"City with cityCode: {cityCode} not found.");
                    return null;
                }

                existingCity.active = updatedCity.active;

                await _context.SaveChangesAsync();
                
                Console.WriteLine($"City {existingCity.name} updated successfully. Active: {existingCity.active}");
                return existingCity;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating city: {ex.Message}");
                throw;
            }
        }
    }
}