using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _repo;

        public JobService(IJobRepository repo)
        {
            _repo = repo;
        }

        public async Task<(bool Success, string Message)> CreateJobAsync(int companyId, CreateJobRequest request)
        {
            var job = new Job
            {
                CompanyId       = companyId,
                JobTitle        = request.JobTitle,
                JobDescription  = request.JobDescription,
                RequiredSkills  = request.RequiredSkills,
                RequiredCGPA    = request.RequiredCGPA,
                Package         = request.Package,
                Location        = request.Location,
                Deadline        = request.Deadline,
                CreatedDate     = DateTime.UtcNow,
                IsActive        = true
            };

            await _repo.AddAsync(job);
            await _repo.SaveAsync();
            return (true, "Job created successfully");
        }

        public async Task<List<Job>> GetAllJobsAsync() =>
            await _repo.GetAllAsync();

        public async Task<Job?> GetJobByIdAsync(int id) =>
            await _repo.GetByIdAsync(id);

        public async Task<List<Job>> GetCompanyJobsAsync(int companyId) =>
            await _repo.GetByCompanyIdAsync(companyId);

        public async Task<(bool Success, string Message)> UpdateJobAsync(int id, int companyId, UpdateJobRequest request)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return (false, "Job not found");
            if (job.CompanyId != companyId) return (false, "Unauthorized");

            job.JobTitle        = request.JobTitle;
            job.JobDescription  = request.JobDescription;
            job.RequiredSkills  = request.RequiredSkills;
            job.RequiredCGPA    = request.RequiredCGPA;
            job.Package         = request.Package;
            job.Location        = request.Location;
            job.Deadline        = request.Deadline;
            job.IsActive        = request.IsActive;

            await _repo.UpdateAsync(job);
            await _repo.SaveAsync();
            return (true, "Job updated successfully");
        }

        public async Task<(bool Success, string Message)> DeleteJobAsync(int id, int companyId)
        {
            var job = await _repo.GetByIdAsync(id);
            if (job == null) return (false, "Job not found");
            if (job.CompanyId != companyId) return (false, "Unauthorized");

            await _repo.DeleteAsync(job);
            await _repo.SaveAsync();
            return (true, "Job deleted successfully");
        }
    }
}
