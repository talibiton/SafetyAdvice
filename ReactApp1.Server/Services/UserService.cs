using Microsoft.EntityFrameworkCore;
using pro.Server.Models;
using ReactApp1.Server.Classes;

namespace pro.Server.Services
{
    public class UserService
    {
        private readonly SafetyAdviceDB _context;

        public UserService(SafetyAdviceDB context)
        {
            _context = context;
        }

        public List<User> GetUsers()
        {
            return _context.Users.ToList();
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.id == id);
        }

        public async Task<User> AddUserAsync(User user)
        {
            try
            {
                // בדיקה אם משתמש עם אותו ID כבר קיים
                var existingUser = await GetUserByIdAsync(user.id);
                if (existingUser != null)
                {
                    throw new Exception("משתמש עם מזהה זה כבר קיים במערכת");
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding user: {ex.Message}");
                throw;
            }
        }
    }
}
