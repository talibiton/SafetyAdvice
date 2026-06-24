using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace pro.Server.Services
{
    public class AuditService
    {
        private readonly SafetyAdviceDB _context;

        public AuditService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Audit> GetAudits()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Audits.ToList();
        }

        public async Task<Audit> GetAuditByIdAsync(int id)
        {
            return await _context.Audits.FirstOrDefaultAsync(a => a.id == id);
        }

    }
    
}
