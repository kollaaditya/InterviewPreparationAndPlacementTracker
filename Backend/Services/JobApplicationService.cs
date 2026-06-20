using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IJobApplicationRepository _appRepo;
        private readonly IJobRepository _jobRepo;

        public JobApplicationService(IJobApplicationRepository appRepo, IJobRepository jobRepo)
        {
            _appRepo = appRepo;
            _jobRepo = jobRepo;
        }

        public async Task<(bool Success, string Message)> ApplyAsync(int studentId, int jobId)
        {
            var job = await _jobRepo.GetByIdAsync(jobId);
            if (job == null) return (false, "Job not found");
            if (!job.IsActive) return (false, "Job is no longer active");
            if (job.Deadline < DateTime.UtcNow) return (false, "Application deadline has passed");

            if (await _appRepo.ExistsAsync(studentId, jobId))
                return (false, "You have already applied for this job");

            await _appRepo.AddAsync(new JobApplication
            {
                StudentId   = studentId,
                JobId       = jobId,
                AppliedDate = DateTime.UtcNow,
                Status      = JobApplicationStatus.Applied
            });

            await _appRepo.SaveAsync();
            return (true, "Application submitted successfully");
        }

        public async Task<List<JobApplication>> GetByStudentAsync(int studentId) =>
            await _appRepo.GetByStudentAsync(studentId);

        public async Task<List<JobApplication>> GetByJobAsync(int jobId) =>
            await _appRepo.GetByJobAsync(jobId);

        public async Task<(bool Success, string Message)> UpdateStatusAsync(int applicationId, JobApplicationStatus status)
        {
            var app = await _appRepo.GetByIdAsync(applicationId);
            if (app == null) return (false, "Application not found");

            app.Status = status;
            await _appRepo.SaveAsync();
            return (true, "Status updated successfully");
        }
    }
}
