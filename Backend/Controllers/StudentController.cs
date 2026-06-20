using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/student")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _service;
        private readonly IWebHostEnvironment _env;

        public StudentController(IStudentService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        // GET api/student
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _service.GetAllAsync();
            return Ok(students.Select(s => new
            {
                s.StudentId,
                s.FullName,
                s.Email,
                s.Phone,
                s.College,
                s.Branch,
                s.CGPA,
                s.Skills,
                s.ResumePath,
                Role = s.Role.ToString()
            }));
        }

        // GET api/student/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _service.GetByIdAsync(id);
            if (student == null) return NotFound("Student not found");

            return Ok(new
            {
                student.StudentId,
                student.FullName,
                student.Email,
                student.Phone,
                student.College,
                student.Branch,
                student.CGPA,
                student.Skills,
                student.ResumePath,
                Role = student.Role.ToString()
            });
        }

        // POST api/student/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(Student student)
        {
            var (success, message) = await _service.RegisterAsync(student);
            return success ? Ok(message) : BadRequest(message);
        }

        // POST api/student/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(StudentLoginRequest request)
        {
            var student = await _service.LoginAsync(request.Email, request.Password);
            if (student == null)
                return Unauthorized("Invalid Credentials");

            return Ok(new
            {
                student.StudentId,
                student.FullName,
                student.Email,
                student.CGPA,
                student.Skills,
                student.ResumePath,
                Role = student.Role.ToString()
            });
        }

        // PUT api/student/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, StudentUpdateRequest request)
        {
            var (success, message) = await _service.UpdateAsync(id, request);
            return success ? Ok(message) : NotFound(message);
        }

        // POST api/student/5/resume
        [HttpPost("{id}/resume")]
        public async Task<IActionResult> UploadResume(int id, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            var allowed = new[] { ".pdf", ".doc", ".docx" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowed.Contains(ext))
                return BadRequest("Only PDF, DOC, DOCX files allowed");

            var uploadDir =
    Path.Combine(
        Directory.GetCurrentDirectory(),
        "wwwroot",
        "resumes");
            Directory.CreateDirectory(uploadDir);

            var fileName = $"student_{id}_{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadDir, fileName);
            Console.WriteLine($"Saving Resume To: {filePath}");

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            var relativePath = $"/resumes/{fileName}";
            var (success, message) = await _service.UpdateResumeAsync(id, relativePath);
            return success ? Ok(new { message, resumePath = relativePath }) : NotFound(message);
        }

        // DELETE api/student/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var (success, message) = await _service.DeleteAsync(id);
            return success ? Ok(message) : NotFound(message);
        }
    }
}
