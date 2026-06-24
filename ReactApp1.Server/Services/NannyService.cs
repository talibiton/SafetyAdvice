using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace pro.Server.Services
{
    public class NannyService
    {
        private readonly SafetyAdviceDB _context;

        public NannyService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Nanny> GetNannies()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Nannies.ToList();
        }

        public async Task<Nanny> GetNannyByIdAsync(string id)
        {
            return await _context.Nannies
                .Include(n => n.kinder) // לוודא שליפת ה- Kindergarten
                    .ThenInclude(k => k.city) // לוודא שליפת העיר של המשפחתון
                .FirstOrDefaultAsync(n => n.id == id);
        }

        //public async Task<Nanny> GetNannyByIdAsync(string id)
        //{
        //    var result = await _context.Nannies
        //         .Select(n => new
        //         {
        //             Nanny = n,
        //             Kinder = _context.Kindergartens
        //                 .Where(k => k.code == n.kindergartenCode) // התאמה לפי ה-Code
        //                 .OrderByDescending(k => k.seqNr) // סידור לפי ה-Seq הגבוה ביותר
        //                 .FirstOrDefault() // בחירת ה- Kindergarten עם ה-Seq הגבוה ביותר
        //         })
        //         .FirstOrDefaultAsync(x => x.Nanny.id == id);

        //    if (result == null)
        //        return null; // אם לא נמצאה מטפלת, מחזירים null

        //    // עדכון של הקשר בין ה-Nanny ל-Kinder
        //    result.Nanny.kinder = result.Kinder;

        //    return result.Nanny; // מחזירים את ה-Nanny עם הקשר המעודכן

        //}
        // public async Task<Nanny> GetNannyByIdAsync(string id)
        // {
        //     return await _context.Nannies
        //.Include(a => a.kinder)
        //.ThenInclude(k => k.city)
        //         .FirstOrDefaultAsync(n => n.id == id);
        //}

        public async Task<List<Nanny>> GetNanniesByHubIdAsync(string hubId)
        {
            var KindergartensId = await _context.Kindergartens
                           .Where(k => k.hubId == hubId)
                           .Select(k => k.code)
                           .ToListAsync();

            return await _context.Nannies
                .Where(n => KindergartensId.Contains(n.kindergartenCode))
                .ToListAsync();
        }
    }
}
