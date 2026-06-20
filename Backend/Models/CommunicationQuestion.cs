using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CommunicationQuestion
    {
        [Key]
        public int QuestionId { get; set; }

        [Required]
        public string QuestionText  { get; set; } = "";

        [Required]
        public string OptionA { get; set; } = "";
        [Required]
        public string OptionB { get; set; } = "";
        [Required]
        public string OptionC { get; set; } = "";
        [Required]
        public string OptionD { get; set; } = "";

        [Required]
        public string CorrectAnswer { get; set; } = ""; // "A" | "B" | "C" | "D"

        [Required]
        public string Topic { get; set; } = ""; // Grammar | Vocabulary | SentenceCorrection | ReadingComprehension

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
