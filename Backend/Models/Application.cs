using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Application
    {
        [Key]
        public int ApplicationId { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Applied;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        // FKs
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        public int DriveId { get; set; }

        [ForeignKey("DriveId")]
        public PlacementDrive? PlacementDrive { get; set; }
    }

    public enum ApplicationStatus
    {
        Applied    = 1,
        Shortlisted = 2,
        Rejected   = 3,
        Selected   = 4
    }
}
