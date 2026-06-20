using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/jobs")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _service;
        private readonly IJobApplicationService _appService;

        public JobsController(IJobService service, IJobApplicationService appService)
        {
            _service    = service;
            _appService = appService;
        }

        // GET api/jobs
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var jobs = await _service.GetAllJobsAsync();
            return Ok(jobs.Select(MapJob));
        }

        // GET api/jobs/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var job = await _service.GetJobByIdAsync(id);
            if (job == null) return NotFound("Job not found");
            return Ok(MapJob(job));
        }

        // GET api/jobs/company/{companyId}
        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetByCompany(int companyId)
        {
            var jobs = await _service.GetCompanyJobsAsync(companyId);
            return Ok(jobs.Select(MapJob));
        }

        // POST api/jobs
        [HttpPost]
        public async Task<IActionResult> Create([FromQuery] int companyId, [FromBody] CreateJobRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (success, message) = await _service.CreateJobAsync(companyId, request);
            return success ? Ok(message) : BadRequest(message);
        }

        // PUT api/jobs/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromQuery] int companyId, [FromBody] UpdateJobRequest request)
        {
            var (success, message) = await _service.UpdateJobAsync(id, companyId, request);
            if (!success) return message == "Unauthorized" ? Forbid() : NotFound(message);
            return Ok(message);
        }

        // GET api/jobs/{jobId}/applicants
        [HttpGet("{jobId}/applicants")]
        public async Task<IActionResult> GetApplicants(int jobId)
        {
            var apps = await _appService.GetByJobAsync(jobId);
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

        // DELETE api/jobs/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, [FromQuery] int companyId)
        {
            var (success, message) = await _service.DeleteJobAsync(id, companyId);
            if (!success) return message == "Unauthorized" ? Forbid() : NotFound(message);
            return Ok(message);
        }

        private static object MapJob(Job j) => new
        {
            j.JobId,
            j.JobTitle,
            j.JobDescription,
            j.RequiredSkills,
            j.RequiredCGPA,
            j.Package,
            j.Location,
            j.Deadline,
            j.CreatedDate,
            j.IsActive,
            j.CompanyId,
            CompanyName = j.Company?.CompanyName
        };
    }
}
