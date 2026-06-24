using pro.Server.Classes;
using System;
using System.Text.Json.Serialization;

namespace ReactApp1.Server.Classes
{
    public class QuestionsForSpace
    {
        // [JsonIgnore] 
        public int id { get; set; }
        public string question { get; set; }
        public bool active { get; set; }
        public string type { get; set; }
        public int priority { get; set; }


        // [JsonIgnore]
        public List<AnswerOptionsForSpace>? options { get; set; }
        public QuestionsForSpace()
        {

        }
    }
}
