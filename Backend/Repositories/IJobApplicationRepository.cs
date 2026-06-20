using Backend.Models;

namespace Backend.Repositories
{
    public interface IJobApplicationRepository
    {
        Task<List<JobApplication>> GetAllAsync();
        Task<JobApplication?> GetByIdAsync(int id);
        Task<List<JobApplication>> GetByStudentAsync(int studentId);
        Task<List<JobApplication>> GetByJobAsync(int jobId);
        Task<bool> ExistsAsync(int studentId, int jobId);
        Task AddAsync(JobApplication application);
        Task SaveAsync();
    }
}
