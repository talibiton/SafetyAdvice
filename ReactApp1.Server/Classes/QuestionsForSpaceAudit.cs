namespace ReactApp1.Server.Classes
{
    public class QuestionsForSpaceAudit
    {
        public int id { get; set; }
        public int auditId { get; set; }
        public int questionId { get; set; }
        public string answer { get; set; }
        public string img { get; set; }
        public int priority { get; set; }

        public QuestionsForSpaceAudit()
        {

        }
    }
}
