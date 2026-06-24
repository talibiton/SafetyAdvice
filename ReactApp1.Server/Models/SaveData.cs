using pro.Server.Classes;
using ReactApp1.Server.Classes;
using System.Text.Json.Serialization;

namespace ReactApp1.Server.Models
{
    public class SaveData
    {
        public string HubId { get; set; }
        public string HubEmail { get; set; }

        public NannyViewModel Nanny { get; set; }

        public Audit[] AuditData { get; set; }
        public QuestionsForSpaceAudit[] QuestionsForSpaceAuditData { get; set; }


        //public Adreess Adreess { get; set; }
        public KindergartenViewModel kinder { get; set; }

        [JsonPropertyName("ApprovalStatus")]
        public int approvalStatus { get; set; }
        
        public int type { get; set; } // סוג המבדק: 0=לא צוין, 1=מבדק שנתי, 2=פתיחת שנה, 3=מילוי מקום
    }



}
