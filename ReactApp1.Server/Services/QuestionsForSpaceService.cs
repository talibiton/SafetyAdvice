using pro.Server.Models;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Classes;
using pro.Server.Classes;


namespace ReactApp1.Server.Services
{
    public class QuestionsForSpaceService
    {
        private readonly SafetyAdviceDB _context;

        public QuestionsForSpaceService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<QuestionsForSpace> GetActiveQuestionsForSpace()
        {
            return _context.QuestionsForSpace.Where(a => a.active == true)
                .Include(s => s.options)
                .ToList();
        }

        public List<QuestionsForSpace> GetAllQuestionsForSpace()
        {
            return _context.QuestionsForSpace
                .Include(s => s.options)
                .ToList();
        }

        public async Task<QuestionsForSpace> GetQuestionForSpaceByIdAsync(int id)
        {
            return await _context.QuestionsForSpace.FirstOrDefaultAsync(q => q.id == id);
        }
        public async Task<QuestionsForSpace?> UpdateQuestionAsync(int id, QuestionsForSpace updatedQuestion)
        {
            var question = await _context.QuestionsForSpace.FindAsync(id);
            if (question == null) return null;

            question.question = updatedQuestion.question;
            question.type = updatedQuestion.type;
            question.active = updatedQuestion.active;
            question.priority = updatedQuestion.priority;

            await _context.SaveChangesAsync();
            return question;
        }
    }
}

