using Backend.Models;

namespace Backend.Services
{
    public interface IJobService
    {
        Task<(bool Success, string Message)> CreateJobAsync(int companyId, CreateJobRequest request);
        Task<List<Job>> GetAllJobsAsync();
        Task<Job?> GetJobByIdAsync(int id);
        Task<List<Job>> GetCompanyJobsAsync(int companyId);
        Task<(bool Success, string Message)> UpdateJobAsync(int id, int companyId, UpdateJobRequest request);
        Task<(bool Success, string Message)> DeleteJobAsync(int id, int companyId);
    }
}
