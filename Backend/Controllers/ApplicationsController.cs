using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/applications")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _service;

        public ApplicationsController(IJobApplicationService service)
        {
            _service = service;
        }

        // POST api/applications
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] ApplyJobRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var (success, message) = await _service.ApplyAsync(request.StudentId, request.JobId);
            return success ? Ok(message) : BadRequest(message);
        }

        // GET api/applications/student/{studentId}
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetByStudent(int studentId)
        {
            var apps = await _service.GetByStudentAsync(studentId);
            return Ok(apps.Select(a => new
            {
                a.ApplicationId,
                a.JobId,
                JobTitle    = a.Job?.JobTitle,
                CompanyName = a.Job?.Company?.CompanyName,
                Package     = a.Job?.Package,
                Location    = a.Job?.Location,
                a.AppliedDate,
                Status      = a.Status.ToString()
            }));
        }

        // GET api/applications/job/{jobId}
        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetByJob(int jobId)
        {
            var apps = await _service.GetByJobAsync(jobId);
            return Ok(apps.Select(a => new
            {
                a.ApplicationId,
                a.StudentId,
                StudentName = a.Student?.FullName,
                Email       = a.Student?.Email,
                College     = a.Student?.College,
                Branch      = a.Student?.Branch,
                CGPA        = a.Student?.CGPA,
                Skills      = a.Student?.Skills,
                ResumePath  = a.Student?.ResumePath,
                a.AppliedDate,
                Status      = a.Status.ToString()
            }));
        }

        // PUT api/applications/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateJobApplicationStatusRequest request)
        {
            var (success, message) = await _service.UpdateStatusAsync(id, request.Status);
            return success ? Ok(message) : NotFound(message);
        }
    }
}
