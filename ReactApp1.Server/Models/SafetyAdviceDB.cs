using Microsoft.EntityFrameworkCore;
using pro.Server.Classes;
using ReactApp1.Server.Classes;

namespace pro.Server.Models
{
    public partial class SafetyAdviceDB : DbContext
    {
        public SafetyAdviceDB(DbContextOptions<SafetyAdviceDB> options)
            : base(options)
        {
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Nanny> Nannies { get; set; }
        public DbSet<Kindergarten> Kindergartens { get; set; }
        public DbSet<Hub> Hubs { get; set; }
        public DbSet<Counselor> Counselors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<AuditDetail> AuditDetails { get; set; }
        public DbSet<Audit> Audits { get; set; }
        public DbSet<CounselorsToOrganization> CounselorsToOrganization { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<QuestionsForSpaceAudit> QuestionsForSpaceAudits { get; set; }
        public DbSet<QuestionsForSpace> QuestionsForSpace { get; set; }
        public DbSet<AnswerOptionsForSpace> AnswerOptionsForSpace { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<City>().HasKey(c => c.cityCode); // הגדרת המפתח הראשי
            modelBuilder.Entity<Organization>().HasKey(o => o.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<Question>().HasKey(q => q.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<Nanny>().HasKey(n => n.id); // הגדרת המפתח הראשי
            //modelBuilder.Entity<Kindergarten>().HasKey(k => k.id); // הגדרת המפתח הראשי 
            modelBuilder.Entity<Kindergarten>().HasOne(k => k.nanny)
                                                .WithOne(n => n.kinder)
                                                .HasForeignKey<Nanny>(n => n.kindergartenCode)
                                                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Hub>().HasKey(h => h.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<Counselor>().HasKey(c => c.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<User>().HasKey(u => u.id); // הגדרת המפתח הראשי 
            modelBuilder.Entity<AuditDetail>().HasKey(a => a.id); // הגדרת המפתח הראשי 
            modelBuilder.Entity<Audit>().HasKey(a => a.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<CounselorsToOrganization>().HasKey(c => new { c.organizationCode, c.counselorId }); // הגדרת המפתח הראשי
            modelBuilder.Entity<AnswerOption>().HasKey(a => a.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<AnswerOptionsForSpace>().HasKey(a => a.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<QuestionsForSpaceAudit>().HasKey(a => a.id); // הגדרת המפתח הראשי
            modelBuilder.Entity<QuestionsForSpace>().HasKey(a => a.id); // הגדרת המפתח הראשי

            modelBuilder.Entity<Hub>()
                .HasMany(h => h.kindergartens)
                .WithOne(k => k.hub)
                .HasForeignKey(k => k.hubId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Kindergarten>()
                .HasOne(k => k.hub)
                .WithMany(h => h.kindergartens)
                .HasForeignKey(k => k.hubId);

            modelBuilder.Entity<AnswerOptionsForSpace>()
                .HasOne<QuestionsForSpace>()
                .WithMany(q => q.options)
                .HasForeignKey(a => a.questionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
