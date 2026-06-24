using System;
using System.Text.Json.Serialization;

namespace pro.Server.Classes
{
    public class Question
    {

       // [JsonIgnore] 
        public int id { get; set; }
        public string question { get; set; }
        public bool active { get; set; }
        public string type { get; set; }
        public int priority { get; set; }


       // [JsonIgnore]
        public List<AnswerOption>? options { get; set; }
        public Question()
        {

        }
    }
}
