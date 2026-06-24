using pro.Server.Classes;
using pro.Server.Services;
using ReactApp1.Server.Services;
using System.Text;

public class DailyEmailJob
{
    private readonly IEmailService _emailSender;
    private readonly KindergartenService _kindergartenService;
    private readonly OrganizationService _organizationService;

    public DailyEmailJob(IEmailService emailSender, KindergartenService kindergartenService, OrganizationService organizationService)
    {
        _emailSender = emailSender;
        _kindergartenService = kindergartenService;
        _organizationService = organizationService;
    }

    public async Task SendDailySummaryEmail()
    {
        //לקחת את כל המשפחתונים שתאריך עדכון שלהם שווה להיום
        List<Kindergarten> kindergartens = await _kindergartenService.GetUpdatedKindergartens();
                
        //לחבר עם הארגון
        var organizationMap = kindergartens
            .GroupBy(k => k.organizationsId)
            .ToDictionary(g => g.Key, g => g.ToList());
            
        // לכל ארגון לשלוח במייל את כל המשפחתונים המעודכנים
        foreach (var kvp in organizationMap)
        {
            string organizationId = kvp.Key;
            List<Kindergarten> updatedKindergartens = kvp.Value;

            // שליפת פרטי הארגון מה-DB
            Organization org = await _organizationService.GetOrganizationByIdAsync(organizationId);
            if (org == null || string.IsNullOrEmpty(org.email))
            {
                Console.WriteLine($"ארגון {organizationId} לא נמצא או ללא מייל");
                continue;
            }

            // יצירת תוכן המייל עם המשפחתונים המעודכנים של הארגון הספציפי
            string emailBody = BuildEmailBody(org, updatedKindergartens);

            // שליחת המייל
            await _emailSender.SendEmailAsync(
                to: org.email,
                subject: $"דו\"ח יומי - עדכוני כתובות משפחתונים - {DateTime.Now:dd/MM/yyyy}",
                body: emailBody
            );
            
            Console.WriteLine($"נשלח מייל לארגון {org.name} עם {updatedKindergartens.Count} משפחתונים");
        }
    }

    private string BuildEmailBody(Organization org, List<Kindergarten> kindergartens)
    {
        var sb = new StringBuilder();

        sb.AppendLine("<html dir='rtl' style='font-family: Arial, sans-serif;'>");
        sb.AppendLine("<body style='text-align: right;'>");

        sb.AppendLine($"<p>שלום {org.name},</p>");
        sb.AppendLine("<p>המשפחתונים שעודכנה להם הכתובת מופיעים מטה עם הכתובת העדכנית.<br>");
        sb.AppendLine("יש לעדכן את הנתונים אצלכם במערכת.</p>");

        sb.AppendLine("<ul style='direction: rtl; text-align: right; list-style-position: inside;'>");
        foreach (var kg in kindergartens)
        {
            sb.AppendLine($"<li>סמל משפחתון {kg.code}: {kg.street} {kg.homeNum}, {kg.city?.name}</li>");
        }
        sb.AppendLine("</ul>");

        sb.AppendLine("<p>בברכה,<br>מערכת יעוץ בטיחות</p>");

        sb.AppendLine("</body>");
        sb.AppendLine("</html>");

        return sb.ToString();
    }
}
