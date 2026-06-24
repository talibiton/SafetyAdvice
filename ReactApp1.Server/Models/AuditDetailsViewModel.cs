using pro.Server.Classes;
using System.Text.Json.Serialization;

namespace ReactApp1.Server.Models
{
    public class AuditDetailsViewModel
    {
        public int id { get; set; }
        public string counselorId { get; set; }
        public int kindergartenCode { get; set; }
        public DateTime auditDate { get; set; }
        public DateTime updateDate { get; set; }
        public int type { get; set; }
        public DateTime validity { get; set; }
        public Boolean approvalStatus { get; set; }


        [JsonIgnore]
        public Kindergarten kinder { get; set; }

        public AuditDetailsViewModel()
        {

        }
    }
}
