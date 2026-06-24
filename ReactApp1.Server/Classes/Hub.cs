namespace pro.Server.Classes
{
    public class Hub
    {
        public string id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phone { get; set; }
        public string email { get; set; }
        public bool active { get; set; }

        public List<Kindergarten>? kindergartens { get; set; }

        public Hub()
        {
                
        }
    }
}
