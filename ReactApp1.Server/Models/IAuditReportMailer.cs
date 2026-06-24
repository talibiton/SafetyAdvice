namespace ReactApp1.Server.Models
{
        public interface IAuditReportMailer
        {
            Task SendMailWithPdfAsync(SaveData data);
        }
}
