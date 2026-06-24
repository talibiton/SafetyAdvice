using pro.Server.Classes;

namespace ReactApp1.Server.Models
{
    public class KindergartenViewModel
    {
        public int code { get; set; }
        //public int code { get; set; }
        //public int cityCode { get; set; }
        public string street { get; set; }
        public int homeNum { get; set; }
        public int floor { get; set; }
        public string hubId { get; set; }
        public string organizationsId { get; set; }
        public int seqNr { get; set; }
        public bool active { get; set; }
        public DateTime updateDate { get; set; }

        public City city { get; set; }
        public KindergartenViewModel()
        {
            
        }
    }
}
