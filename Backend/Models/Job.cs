using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Job
    {
        [Key]
        public int JobId { get; set; }

        [Required]
        public string JobTitle { get; set; } = "";

        [Required]
        public string JobDescription { get; set; } = "";

        public string RequiredSkills { get; set; } = "";

        public decimal RequiredCGPA { get; set; } = 0;

        [Required]
        public decimal Package { get; set; }

        public string Location { get; set; } = "";

        [Required]
        public DateTime Deadline { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        // FK → Company
        public int CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }
    }
}
