using System.Collections.Generic;

namespace ReactApp1.Server.Models
{
    public class FullAuditWithQuestionsViewModel
    {
        public AuditFullDetails audit { get; set; }
        public List<QuestionWithAnswerViewModel> questions { get; set; }
    }
}
