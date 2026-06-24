using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace pro.Server.Services
{
    public class CounselorsToOrganizationService
    {
        private readonly SafetyAdviceDB _context;

        public CounselorsToOrganizationService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<CounselorsToOrganization> GetCounselorsToOrganization()
        {
            // שליפת כל הארגונים מה- DB
            return _context.CounselorsToOrganization.ToList();
        }

        public async Task<CounselorsToOrganization> GetCounselorsToOrganizationByorganizationCodeAsync(string organizationCode)
        {
            return await _context.CounselorsToOrganization.FirstOrDefaultAsync(o => o.organizationCode == organizationCode);
        }

        public async Task<CounselorsToOrganization> GetCounselorsToOrganizationBycounselorIdAsync(string counselorId)
        {
            return await _context.CounselorsToOrganization.FirstOrDefaultAsync(o => o.counselorId == counselorId);
        }
    }
}
