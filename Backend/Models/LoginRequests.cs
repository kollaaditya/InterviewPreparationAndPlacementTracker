namespace Backend.Models
{
    public class StudentLoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class CompanyLoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    public class AdminLoginRequest
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
