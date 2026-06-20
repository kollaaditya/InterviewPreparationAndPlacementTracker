using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AptitudeQuestion
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
        public string Category { get; set; } = ""; // Quantitative | Reasoning | Logical | DataInterpretation

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
