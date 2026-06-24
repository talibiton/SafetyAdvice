using pro.Server.Models;
using pro.Server.Services;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Services;
using ReactApp1.Server.Models;
using QuestPDF.Infrastructure;
using Hangfire;
using System;

var builder = WebApplication.CreateBuilder(args);
QuestPDF.Settings.License = LicenseType.Community;

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://localhost:5173", "http://localhost:5173")  // הוספת HTTP גם
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// רישום ה-DbContext עם השימוש במחרוזת החיבור
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddHangfire(config =>
    config.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
          .UseSimpleAssemblyNameTypeSerializer()
          .UseRecommendedSerializerSettings()
          .UseSqlServerStorage(connectionString));

builder.Services.AddHangfireServer();

builder.Services.AddDbContext<SafetyAdviceDB>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddTransient<DailyEmailJob>();

builder.Services.AddScoped<AuditDetailService>();
builder.Services.AddScoped<AuditService>();
builder.Services.AddScoped<CityService>();
builder.Services.AddScoped<CounselorService>();
builder.Services.AddScoped<CounselorsToOrganizationService>();
builder.Services.AddScoped<HubService>();
builder.Services.AddScoped<KindergartenService>();
builder.Services.AddScoped<NannyService>();
builder.Services.AddScoped<OrganizationService>();
builder.Services.AddScoped<QuestionService>();
builder.Services.AddScoped<ReportService>();
builder.Services.AddScoped<SaveService>();
builder.Services.AddScoped<QuestionsForSpaceAuditService>();
builder.Services.AddScoped<QuestionsForSpaceService>();
builder.Services.AddScoped<UserService>();

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseHangfireDashboard();

// Resolve Israel timezone in a cross-platform way (Windows uses "Israel Standard Time", Linux uses "Asia/Jerusalem").
// Fall back to UTC if resolution fails to avoid crashing the app on startup in cloud environments.
TimeZoneInfo israelTimeZone;
try
{
    try
    {
        israelTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Israel Standard Time");
    }
    catch (TimeZoneNotFoundException)
    {
        // Try the IANA timezone id used on Linux
        israelTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Jerusalem");
    }
}
catch (Exception ex)
{
    // If timezone lookup fails for any reason, log and fall back to UTC so the app can start.
    Console.WriteLine($"Warning: could not resolve Israel timezone, falling back to UTC. Details: {ex.Message}");
    israelTimeZone = TimeZoneInfo.Utc;
}

try
{
    RecurringJob.AddOrUpdate<DailyEmailJob>(
        recurringJobId: "daily-report",
        methodCall: job => job.SendDailySummaryEmail(),
        cronExpression: "20 22 * * *",
        options: new RecurringJobOptions
        {
            TimeZone = israelTimeZone
        });
}
catch (Exception ex)
{
    // Don't let recurring job registration prevent the application from starting in production.
    Console.WriteLine($"Warning: failed to register recurring job: {ex.Message}");
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
