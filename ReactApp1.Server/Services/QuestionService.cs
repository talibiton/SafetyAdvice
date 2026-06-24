using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace pro.Server.Services
{
    public class QuestionService
    {
        private readonly SafetyAdviceDB _context;

        public QuestionService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Question> GetActiveQuestions()
        {
            return _context.Questions.Where(a => a.active == true)
                .Include(s => s.options)
                .ToList();

        }

        public List<Question> GetAllQuestions()
        {
            return _context.Questions
                .Include(s => s.options)
                .ToList();
        }

        public async Task<Question> GetQuestionByIdAsync(int id)
        {
            return await _context.Questions.FirstOrDefaultAsync(q => q.id == id);
        }

        public async Task<Question?> UpdateQuestionAsync(int id, Question updatedQuestion)
        {
            var question = await _context.Questions.FindAsync(id);
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

