using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using pro.Server.Models;

namespace pro.Server.Services
{
    public class HubService
    {
        private readonly SafetyAdviceDB _context;

        public HubService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<Hub> GetHubs()
        {
            // שליפת כל הארגונים מה- DB
            return _context.Hubs.ToList();
        }

        public async Task<Hub> GetHubByIdAsync(string id)
        {
            return await _context.Hubs.FirstOrDefaultAsync(o => o.id == id);
        }

        public async Task<Hub> UpdateHubAsync(string id, Hub updatedHub)
        {
            try
            {
                var existingHub = await _context.Hubs.FirstOrDefaultAsync(h => h.id == id);
                
                if (existingHub == null)
                {
                    return null;
                }

                // עדכון כל השדות
                existingHub.firstName = updatedHub.firstName;
                existingHub.lastName = updatedHub.lastName;
                existingHub.phone = updatedHub.phone;
                existingHub.email = updatedHub.email;
                existingHub.active = updatedHub.active;

                await _context.SaveChangesAsync();
                
                Console.WriteLine($"Hub {existingHub.firstName} {existingHub.lastName} updated successfully");
                return existingHub;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating hub: {ex.Message}");
                throw;
            }
        }

        //public async Task<List<Hub>> GetHubByOrganizationIdAsync(string organizationId)
        //{
        //    var hubs = await (from h in _context.Hubs
        //                      join k in _context.Kindergartens on h.id equals k.hubId into hk
        //                      from k in hk.DefaultIfEmpty() // LEFT JOIN
        //                      where k.organizationsId == organizationId
        //                      && k.seqNr == _context.Kindergartens
        //                          .Where(kk => kk.code == k.code)
        //                          .Max(kk => kk.seqNr) // מקסימלי לפי seqNr
        //                      join n in _context.Nannies on k.code equals n.kindergartenCode into kn
        //                      from n in kn.DefaultIfEmpty() // LEFT JOIN
        //                      select h)
        //                     .Include(h => h.kindergartens)
        //                         .ThenInclude(k => k.nanny)
        //                     .Include(h => h.kindergartens)
        //                         .ThenInclude(k => k.city)
        //                     .ToListAsync();

        //    return hubs;
        //}
        //    public async Task<List<Hub>> GetHubByOrganizationIdAsync(string organizationId)
        //    {
        //        //var hubs = await _context.Hubs
        //        //    .Include(h => h.kindergartens)
        //        //        .ThenInclude(k => k.nanny) // לוודא שליפת המטפלת
        //        //    .Include(h => h.kindergartens)
        //        //        .ThenInclude(k => k.city)  // לוודא שליפת העיר
        //        //    .Where(h => h.kindergartens.Any(k => k.organizationsId == organizationId))
        //        //    //.Select(h => new
        //        //    //{
        //        //    //    HubId = h.id,
        //        //    //    KindergartensCount = h.kindergartens.Count
        //        //    //})
        //        //    .ToListAsync();


        //        //var hubs = await (from h in _context.Hubs
        //        //                  join k in _context.Kindergartens on h.id equals k.hubId
        //        //                  where k.organizationsId == organizationId
        //        //                  select h)
        //        //      .Include(h => h.kindergartens)
        //        //          .ThenInclude(k => k.nanny)
        //        //      .Include(h => h.kindergartens)
        //        //          .ThenInclude(k => k.city)
        //        //      .Distinct()
        //        //      .ToListAsync();
        //        //        var hubs = await _context.Hubs
        //        //.Include(h => h.kindergartens)
        //        //    .ThenInclude(k => k.nanny)  // לוודא שליפת המטפלת
        //        //.Include(h => h.kindergartens)
        //        //    .ThenInclude(k => k.city)   // לוודא שליפת העיר
        //        //.Where(h => h.kindergartens.Any(k => k.organizationsId == organizationId))
        //        //.ToListAsync();

        //        //        var kindergartensWithNannies = await _context.Kindergartens
        //        //.Include(k => k.nanny)
        //        //.Where(k => k.hubId == "234474666") // החליפי ל-hubId רלוונטי
        //        //.Select(k => new
        //        //{
        //        //    KindergartenId = k.code,
        //        //    NannyId = k.nanny != null ? k.nanny.id : "NULL"
        //        //})
        //        //.ToListAsync();

        //        var hubs = await _context.Hubs
        //.Where(h => h.kindergartens.Any(k => k.organizationsId == organizationId))
        //.Select(h => new
        //{
        //    Hub = h,
        //    Kindergartens = h.kindergartens.Select(k => new
        //    {
        //        Kindergarten = k,
        //        Nanny = _context.Nannies.FirstOrDefault(n => n.kindergartenCode == k.code)
        //    }).ToList()
        //})
        //.ToListAsync();


        //        return hubs;

        //    }
        public async Task<List<Hub>> GetHubByOrganizationIdAsync(string organizationId)
        {
            var hubsData = await _context.Hubs
           .Where(h => h.kindergartens.Any(k => k.organizationsId == organizationId))
           .Select(h => new
           {
               Hub = h,
               Kindergarten = h.kindergartens
                   .OrderByDescending(k => k.seqNr)
                   .Select(k => new
                   {
                       Kindergarten = k,
                       City = k.city,
                       Nanny = _context.Nannies
                           .Where(n => n.kindergartenCode == k.code)
                           .FirstOrDefault() // שליפה ישירה של ה-Nanny
                   })
                   .FirstOrDefault()
           })
           .ToListAsync();

            // המרת הנתונים לרשימת HUB אמיתית
            var hubs = hubsData.Select(h =>
            {
                if (h.Kindergarten != null)
                {
                    var kindergarten = h.Kindergarten.Kindergarten;
                    kindergarten.nanny = h.Kindergarten.Nanny; // שמירת ה-Nanny
                    kindergarten.city = h.Kindergarten.City; // שמירת העיר

                    h.Hub.kindergartens = new List<Kindergarten> { kindergarten };
                }
                return h.Hub;
            }).ToList();


            return hubs;
            //הצורה הזו עובדת 
        }

    }
}
