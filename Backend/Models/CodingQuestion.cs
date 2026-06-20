using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CodingQuestion
    {
        [Key]
        public int QuestionId { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        public string InputFormat  { get; set; } = "";
        public string OutputFormat { get; set; } = "";
        public string SampleInput  { get; set; } = "";
        public string SampleOutput { get; set; } = "";

        [Required]
        public string Difficulty { get; set; } = "Easy"; // Easy | Medium | Hard

        public string Language { get; set; } = "Any"; // Any | C# | Java | Python | C++

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
