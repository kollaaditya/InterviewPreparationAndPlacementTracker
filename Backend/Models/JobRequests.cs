using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CreateJobRequest
    {
        [Required] public string JobTitle       { get; set; } = "";
        [Required] public string JobDescription { get; set; } = "";
        public string   RequiredSkills { get; set; } = "";
        public decimal  RequiredCGPA   { get; set; } = 0;
        [Required] public decimal Package       { get; set; }
        public string   Location       { get; set; } = "";
        [Required] public DateTime Deadline     { get; set; }
    }

    public class UpdateJobRequest
    {
        public string   JobTitle       { get; set; } = "";
        public string   JobDescription { get; set; } = "";
        public string   RequiredSkills { get; set; } = "";
        public decimal  RequiredCGPA   { get; set; }
        public decimal  Package        { get; set; }
        public string   Location       { get; set; } = "";
        public DateTime Deadline       { get; set; }
        public bool     IsActive       { get; set; } = true;
    }

    public class ApplyJobRequest
    {
        [Required] public int StudentId { get; set; }
        [Required] public int JobId     { get; set; }
    }

    public class UpdateJobApplicationStatusRequest
    {
        [Required] public JobApplicationStatus Status { get; set; }
    }
}
