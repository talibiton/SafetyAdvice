using System.Collections.Generic;

namespace ReactApp1.Server.Models
{
    public class QuestionWithAnswerViewModel
    {
        public int questionId { get; set; }
        public string questionText { get; set; } = string.Empty;
        public string answer { get; set; } = string.Empty;
        public string img { get; set; } = string.Empty;
        public int priority { get; set; }
        public List<string> options { get; set; } = new List<string>();
        public List<AnswerOptionViewModel> answerOptions { get; set; } = new List<AnswerOptionViewModel>();
        public string questionType { get; set; } = string.Empty;
    }
}
