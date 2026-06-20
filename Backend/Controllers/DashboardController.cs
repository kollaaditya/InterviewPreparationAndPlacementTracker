using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("student")]
        public IActionResult StudentDashboard()
        {
            return Ok("Student Dashboard");
        }

        [HttpGet("company")]
        public IActionResult CompanyDashboard()
        {
            return Ok("Company Dashboard");
        }

        [HttpGet("admin")]
        public IActionResult AdminDashboard()
        {
            return Ok("Admin Dashboard");
        }
    }
}