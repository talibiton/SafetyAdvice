using pro.Server.Models;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Classes;

namespace ReactApp1.Server.Services
{
    public class QuestionsForSpaceAuditService
    {
        private readonly SafetyAdviceDB _context;

        public QuestionsForSpaceAuditService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<QuestionsForSpaceAudit> GetQuestionsForSpaceAudit()
        {
            return _context.QuestionsForSpaceAudits.ToList();
        }

        public async Task<QuestionsForSpaceAudit> GetQuestionsForSpaceAuditByIdAsync(int id)
        {
            return await _context.QuestionsForSpaceAudits.FirstOrDefaultAsync(a => a.id == id);
        }

    }
}
