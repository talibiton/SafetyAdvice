using pro.Server.Classes;
using pro.Server.Models;

namespace ReactApp1.Server.Models
{
    public class AuditFullDetails
    {      
        public AuditDetail auditDetail { get; set; }
        public KindergartenViewModel kindergarten { get; set; }
        public Counselor counselor { get; set; }
        public OrganizationViewModel organization { get; set; }
        public HubViewModel hub { get; set; }
        public NannyViewModel nanny { get; set; }
      //  public City city { get; set; }
    }

}
