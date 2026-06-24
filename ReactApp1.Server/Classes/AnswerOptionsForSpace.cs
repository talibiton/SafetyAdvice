namespace ReactApp1.Server.Classes
{
    public class AnswerOptionsForSpace
    { 
        //  [JsonIgnore]
        public int id { get; set; }
        public int questionId { get; set; }
        public string option { get; set; }
        public AnswerOptionsForSpace()
        {

        }
    }
}