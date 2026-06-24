using System.ComponentModel.DataAnnotations.Schema;

namespace pro.Server.Classes
{
    public class AuditDetail
    {
        public int id { get; set; }
        public string counselorId { get; set; }
        public int kindergartenCode { get; set; }
        public DateTime auditDate { get; set; }
        public DateTime updateDate { get; set; }
        public int type { get; set; }
        public DateTime validity { get; set; }
        public int approvalStatus { get; set; }

        public AuditDetail()
        {

        }
    }
}
