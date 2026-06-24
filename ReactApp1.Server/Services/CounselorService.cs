using pro.Server.Models;
using pro.Server.Classes;
using Microsoft.EntityFrameworkCore;

namespace pro.Server.Services
{
    public class CounselorService
    {
        private readonly SafetyAdviceDB _context;

        public CounselorService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Counselor> GetCounselors()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Counselors.ToList();
        }

        public async Task<Counselor> GetCounselorByIdAsync(string id)
        {
            return await _context.Counselors.FirstOrDefaultAsync(c => c.id == id);
        }

        public async Task<Counselor> AddCounselorAsync(Counselor counselor)
        {
            // בדיקה אם יועץ עם אותו מזהה כבר קיים
            var existingCounselor = await _context.Counselors.FirstOrDefaultAsync(c => c.id == counselor.id);
            if (existingCounselor != null)
            {
                throw new Exception("יועץ עם מזהה זה כבר קיים במערכת");
            }

            _context.Counselors.Add(counselor);
            await _context.SaveChangesAsync();
            return counselor;
        }

        public async Task<Counselor> UpdateCounselorAsync(string id, Counselor updatedCounselor)
        {
            try
            {
                var existingCounselor = await _context.Counselors.FirstOrDefaultAsync(c => c.id == id);
                
                if (existingCounselor == null)
                {
                    return null;
                }

                // עדכון כל השדות
                existingCounselor.firstName = updatedCounselor.firstName;
                existingCounselor.lastName = updatedCounselor.lastName;
                existingCounselor.phone = updatedCounselor.phone;
                existingCounselor.email = updatedCounselor.email;
                existingCounselor.password = updatedCounselor.password;
                existingCounselor.documentary = updatedCounselor.documentary;
                existingCounselor.signature = updatedCounselor.signature;

                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Counselor {existingCounselor.firstName} {existingCounselor.lastName} updated successfully");
                return existingCounselor;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating counselor: {ex.Message}");
                throw;
            }
        }
    }
}
