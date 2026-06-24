using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace ReactApp1.Server.Services
{
    public class AnswerOptionsService
    {
        private readonly SafetyAdviceDB _context;

        public AnswerOptionsService(SafetyAdviceDB context)
        {
            _context = context;
        }
        public List<AnswerOption> GetAnswerOptions()
        {
            return _context.AnswerOptions.ToList();
        }

        public async Task<AnswerOption> GetAnswerOptionsByIdAsync(int id)
        {
            return await _context.AnswerOptions.FirstOrDefaultAsync(a => a.id == id);
        }
    }
}
