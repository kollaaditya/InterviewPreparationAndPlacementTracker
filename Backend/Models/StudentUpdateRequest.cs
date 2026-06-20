namespace Backend.Models
{
    public class StudentUpdateRequest
    {
        public string FullName { get; set; } = "";
        public string Phone { get; set; } = "";
        public string College { get; set; } = "";
        public string Branch { get; set; } = "";
        public decimal CGPA { get; set; }
        public string Skills { get; set; } = "";
    }
}
