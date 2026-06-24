using System.Net;
using System.Net.Mail;

namespace ReactApp1.Server.Services
{
    public interface IEmailService
    {
        Task SendEmailWithPdfAsync(byte[] pdfBytes, string recipientEmail, string subject, string body);
        Task SendEmailAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly string _fromEmail = "m22489548@gmail.com";
        private readonly string _appPassword = "fsbk sarm ybuu lwwt"; // App Password מגוגל

        //    public async Task SendEmailWithPdfAsync(byte[] pdfBytes, string recipientEmail, string subject, string body)
        //    {
        //        var message = new MailMessage
        //        {
        //            From = new MailAddress(_fromEmail),
        //            Subject = subject,
        //            Body = body
        //        };

        //        message.To.Add(recipientEmail);

        //        using var stream = new MemoryStream(pdfBytes);
        //        message.Attachments.Add(new Attachment(stream, "AuditReport.pdf", "application/pdf"));

        //        using var client = new SmtpClient("smtp.gmail.com", 587)
        //        {
        //            Credentials = new NetworkCredential(_fromEmail, _appPassword),
        //            EnableSsl = true
        //        };

        //        await client.SendMailAsync(message);
        //    }
        //}

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(_fromEmail, _appPassword),
                EnableSsl = true
            };

            var message = new MailMessage(_fromEmail, to, subject, body);
            message.IsBodyHtml =true;
            await smtp.SendMailAsync(message);
        }

        public async Task SendEmailWithPdfAsync(byte[] pdfBytes, string recipientEmail, string subject, string body)
        {
            var message = new MailMessage
            {
                From = new MailAddress(_fromEmail),
                Subject = subject,
                Body = body
            };

            message.To.Add(recipientEmail);

            // קובץ PDF עם שם דינמי בעברית
            string fileName = subject + ".pdf"; // זה כבר כולל את שם המטפלת

            using var stream = new MemoryStream(pdfBytes);
            message.Attachments.Add(new Attachment(stream, fileName, "application/pdf"));

            using var client = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(_fromEmail, _appPassword),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}

