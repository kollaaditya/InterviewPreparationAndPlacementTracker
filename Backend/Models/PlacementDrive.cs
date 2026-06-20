using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class PlacementDrive
    {
        [Key]
        public int DriveId { get; set; }

        [Required]
        public string Title { get; set; } = "";

        [Required]
        public string Description { get; set; } = "";

        [Required]
        public DateTime DriveDate { get; set; }

        [Required]
        public decimal Package { get; set; }

        public string EligibilityCriteria { get; set; } = "";

        public string Location { get; set; } = "";

        public DriveStatus Status { get; set; } = DriveStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // FK
        public int CompanyId { get; set; }

        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }
    }

    public enum DriveStatus
    {
        Active = 1,
        Closed = 2,
        Completed = 3
    }
}
