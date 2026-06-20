using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class CodeSubmission
    {
        [Key]
        public int SubmissionId { get; set; }

        public int StudentId   { get; set; }
        public int QuestionId  { get; set; }

        [Required]
        public string Language   { get; set; } = "";

        [Required]
        public string SourceCode { get; set; } = "";

        public string Output     { get; set; } = "";
        public string Status     { get; set; } = "Pending"; // Accepted | Wrong Answer | Runtime Error | Pending

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        [ForeignKey("QuestionId")]
        public CodingQuestion? CodingQuestion { get; set; }
    }
}
