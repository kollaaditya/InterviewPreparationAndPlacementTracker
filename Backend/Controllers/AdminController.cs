using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _service;

        public AdminController(IAdminService service)
        {
            _service = service;
        }

        // POST api/admin/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(AdminLoginRequest request)
        {
            var admin = await _service.LoginAsync(request.Username, request.Password);
            if (admin == null) return Unauthorized("Invalid Credentials");

            return Ok(new
            {
                admin.AdminId,
                admin.Username,
                Role = admin.Role.ToString()
            });
        }

        // GET api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
            => Ok(await _service.GetStatsAsync());

        // GET api/admin/reports
        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
            => Ok(await _service.GetReportsAsync());
    }
}
