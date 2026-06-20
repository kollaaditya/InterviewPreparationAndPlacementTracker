using Backend.Models;

namespace Backend.Services
{
    public interface IJobApplicationService
    {
        Task<(bool Success, string Message)> ApplyAsync(int studentId, int jobId);
        Task<List<JobApplication>> GetByStudentAsync(int studentId);
        Task<List<JobApplication>> GetByJobAsync(int jobId);
        Task<(bool Success, string Message)> UpdateStatusAsync(int applicationId, JobApplicationStatus status);
    }
}
