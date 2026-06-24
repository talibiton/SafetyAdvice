using System.Text.Json.Serialization;

namespace pro.Server.Classes
{
    public class Nanny
    {
        public string id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public int kindergartenCode { get; set; }
        public int seniority { get; set; }

        [JsonIgnore]
        public Kindergarten kinder { get; set; }
        public Nanny()
        {

        }
    }
}
