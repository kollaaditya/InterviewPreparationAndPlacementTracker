using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }

        [Required]
        public string CompanyName { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        [Required]
        public decimal Package { get; set; }

        public string EligibilityCriteria { get; set; } = "";

        public string JobDescription { get; set; } = "";

        public UserRole Role { get; set; } = UserRole.Company;
    }
}
