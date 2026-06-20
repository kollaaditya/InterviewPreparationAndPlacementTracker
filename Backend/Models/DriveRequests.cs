using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class CreateDriveRequest
    {
        [Required] public string Title { get; set; } = "";
        [Required] public string Description { get; set; } = "";
        [Required] public DateTime DriveDate { get; set; }
        [Required] public decimal Package { get; set; }
        public string EligibilityCriteria { get; set; } = "";
        public string Location { get; set; } = "";
    }

    public class UpdateDriveRequest
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public DateTime DriveDate { get; set; }
        public decimal Package { get; set; }
        public string EligibilityCriteria { get; set; } = "";
        public string Location { get; set; } = "";
        public DriveStatus Status { get; set; }
    }

    public class UpdateApplicationStatusRequest
    {
        public ApplicationStatus Status { get; set; }
    }
}
