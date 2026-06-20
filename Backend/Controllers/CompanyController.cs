using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service)
        {
            _service = service;
        }

        // GET api/company
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(list.Select(c => new
            {
                c.CompanyId, c.CompanyName, c.Email,
                c.Package, c.EligibilityCriteria, c.JobDescription,
                Role = c.Role.ToString()
            }));
        }

        // GET api/company/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var company = await _service.GetByIdAsync(id);
            if (company == null) return NotFound("Company not found");

            return Ok(new
            {
                company.CompanyId, company.CompanyName, company.Email,
                company.Package, company.EligibilityCriteria, company.JobDescription,
                Role = company.Role.ToString()
            });
        }

        // GET api/company/5/eligible-students
        [HttpGet("{id}/eligible-students")]
        public async Task<IActionResult> GetEligibleStudents(int id)
        {
            var students = await _service.GetEligibleStudentsAsync(id);
            return Ok(students.Select(s => new
            {
                s.StudentId, s.FullName, s.Email,
                s.College, s.Branch, s.CGPA, s.Skills, s.ResumePath
            }));
        }

        // POST api/company/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(Company company)
        {
            var (success, message) = await _service.RegisterAsync(company);
            return success ? Ok(message) : BadRequest(message);
        }

        // POST api/company/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(CompanyLoginRequest request)
        {
            var company = await _service.LoginAsync(request.Email, request.Password);
            if (company == null) return Unauthorized("Invalid Credentials");

            return Ok(new
            {
                company.CompanyId, company.CompanyName, company.Email,
                company.Package, company.EligibilityCriteria, company.JobDescription,
                Role = company.Role.ToString()
            });
        }

        // PUT api/company/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CompanyUpdateRequest request)
        {
            var (success, message) = await _service.UpdateAsync(id, request);
            return success ? Ok(message) : NotFound(message);
        }

        // DELETE api/company/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _service.DeleteAsync(id);
            return success ? Ok(message) : NotFound(message);
        }
    }
}
