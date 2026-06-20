using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class AptitudeResult
    {
        [Key]
        public int ResultId { get; set; }

        public int StudentId       { get; set; }
        public int Score           { get; set; }
        public int TotalQuestions  { get; set; }

        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }
    }
}
