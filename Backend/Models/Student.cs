using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Student
    {
        [Key]
        public int StudentId { get; set; }

        [Required]
        public string FullName { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string Phone { get; set; } = "";

        [Required]
        public string College { get; set; } = "";

        [Required]
        public string Branch { get; set; } = "";

        [Required]
        public string Password { get; set; } = "";

        public decimal CGPA { get; set; } = 0;

        public string Skills { get; set; } = "";

        public string ResumePath { get; set; } = "";

        public UserRole Role { get; set; } = UserRole.Student;
    }
}
