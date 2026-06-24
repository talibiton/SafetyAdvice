using System.Text.Json.Serialization;

namespace pro.Server.Classes
{
    public class AnswerOption
    {
      //  [JsonIgnore]
        public int id { get; set; }
        public int questionId { get; set; }
        public string option { get; set; }
        public AnswerOption()
        {

        }
    }
}
