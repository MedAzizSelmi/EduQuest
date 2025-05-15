using System.Collections.Generic;

namespace ELearningPlatform.API.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int Points { get; set; }
        public QuestionType Type { get; set; }
        public int QuizId { get; set; }
        public Quiz Quiz { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public ICollection<Answer> Answers { get; set; }
    }

    public enum QuestionType
    {
        MultipleChoice,
        TrueFalse,
        ShortAnswer,
        Essay,
        Coding
    }
}
