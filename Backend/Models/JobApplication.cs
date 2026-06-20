using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class JobApplication
    {
        [Key]
        public int ApplicationId { get; set; }

        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        public JobApplicationStatus Status { get; set; } = JobApplicationStatus.Applied;

        // FK → Student
        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student? Student { get; set; }

        // FK → Job
        public int JobId { get; set; }

        [ForeignKey("JobId")]
        public Job? Job { get; set; }
    }

    public enum JobApplicationStatus
    {
        Applied     = 1,
        Shortlisted = 2,
        Rejected    = 3,
        Selected    = 4
    }
}
