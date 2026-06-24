using pro.Server.Classes;
using pro.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace pro.Server.Services
{
    public class KindergartenService
    {
        private readonly SafetyAdviceDB _context;

        public KindergartenService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Kindergarten> GetKindergartens()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Kindergartens.ToList();
        }

        public async Task<List<Kindergarten>> GetUpdatedKindergartens()
        {
            // שליפת כל הארגונים מה- DB
            return await _context.Kindergartens
                .Include(k => k.city)
                .Where(data => data.updateDate.Date == DateTime.Today).ToListAsync();
        }

        //public async Task<Kindergarten> GetKindergartenByCodeAsync(int code)
        //{
        //    return await _context.Kindergartens.FirstOrDefaultAsync(k => k.code == code);
        //}

        public async Task<Kindergarten> GetKindergartenByCodeAsync(int code)
        {
            return await _context.Kindergartens
                .Include(k => k.nanny) // לוודא שליפת המטפלת
                .FirstOrDefaultAsync(k => k.code == code);
        }

    }
}
