//using ReactApp1.Server.Models;
//using System.Net.Mail;
//using System.Net;
//using System.Reflection;
//using QuestPDF.Fluent;
//using QuestPDF.Infrastructure;

//namespace ReactApp1.Server.Models
//{
//    public class AuditReportMailer : IAuditReportMailer
//    {
//        public async Task SendMailWithPdfAsync(SaveData data)
//        {
//            var pdfBytes = GeneratePdf(data);

//            using var client = new SmtpClient("smtp.yourserver.com")
//            {
//                Port = 587,
//                Credentials = new NetworkCredential("your-email@example.com", "password"),
//                EnableSsl = true,
//            };

//            var mail = new MailMessage();
//            mail.To.Add(data.EmailHub); // ✅ מהמסד

//           // mail.To.Add(data.N);
//            mail.To.Add("coordinator@example.com");
//            mail.Subject = "דו״ח מבדק חדש";
//            mail.Body = "מצורף דו״ח מבדק PDF.";
//            mail.Attachments.Add(new Attachment(new MemoryStream(pdfBytes), "audit-report.pdf"));

//            await client.SendMailAsync(mail);
//        }
//        public byte[] GeneratePdf(SaveData data)
//        {
//            var date = DateTime.Now.ToString("yyyy-MM-dd");

//            return QuestPDF.Fluent.Document.Create(container =>
//            {
//                container.Page(page =>
//                {
//                    page.Margin(50);
//                    page.Header().Text($"דו״ח מבדק עבור {data.Nanny?.FirstName} {data.Nanny?.LastName}").Bold().FontSize(20);

//                    page.Content().Column(col =>
//                    {
//                        col.Item().Text($"תאריך בדיקה: {date}");
//                        col.Item().Text($"רכזת: {data.HubId?.Id}");
//                        col.Item().Text($"מייל רכזת: {data.HubId?.EmailHub}");
//                        col.Item().Text($"כתובת: {data.Kinder?.Street} {data.Kinder?.HomeNum}, קומה {data.Kinder?.Floor} - {data.Kinder?.City?.Name}");
//                        col.Item().Text($"טלפון: {data.Nanny?.Phone}");
//                        col.Item().Text($"מייל מטפלת: {data.Nanny?.Email}");
//                        col.Item().Text($"סטטוס אישור: {(data.ApprovalStatus ? "מאושר" : "לא מאושר")}");

//                        col.Item().Text("ליקויים:");
//                        foreach (var item in data.AuditData)
//                        {
//                            col.Item().Text($"- {item.QuestionText}: {item.Answer}");
//                        }
//                    });
//                });
//            }).GeneratePdf();
//        }

//    }
//}
