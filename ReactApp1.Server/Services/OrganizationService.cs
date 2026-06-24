using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;
using pro.Server.Services;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace pro.Server.Services
{
    public class OrganizationService 
    {
        private readonly SafetyAdviceDB _context;

        public OrganizationService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Organization> GetOrganizations()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Organizations.ToList();
        }

        public async Task<Organization> GetOrganizationByIdAsync(string id)
        {
            return await _context.Organizations.FirstOrDefaultAsync(o => o.id == id);
        }

        public async Task<Organization> GetOrganizationByNameAsync(string name)
        {
            return await _context.Organizations.FirstOrDefaultAsync(o => o.name.ToLower() == name.ToLower());
        }

        public async Task<Organization> AddOrganizationAsync(Organization organization)
        {
            try
            {
                // בדיקה אם ארגון עם אותו שם כבר קיים
                var existingOrganization = await GetOrganizationByNameAsync(organization.name);
                if (existingOrganization != null)
                {
                    throw new Exception("ארגון עם שם זה כבר קיים במערכת");
                }

                // יצירת ID חדש לארגון
                var maxId = await _context.Organizations
                    .Select(o => o.id)
                    .OrderByDescending(id => id)
                    .FirstOrDefaultAsync();

                int newIdNumber = 1;
                if (!string.IsNullOrEmpty(maxId) && int.TryParse(maxId, out int currentMaxId))
                {
                    newIdNumber = currentMaxId + 1;
                }

                organization.id = newIdNumber.ToString();

                _context.Organizations.Add(organization);
                await _context.SaveChangesAsync();

                return organization;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding organization: {ex.Message}");
                throw;
            }
        }
    }
}
