using Backend.Models;

namespace Backend.Repositories
{
    public interface IApplicationRepository
    {
        Task<List<Application>> GetByStudentAsync(int studentId);
        Task<List<Application>> GetByDriveAsync(int driveId);
        Task<List<Application>> GetAllAsync();
        Task<Application?> GetByIdAsync(int id);
        Task<bool> ExistsAsync(int studentId, int driveId);
        Task AddAsync(Application application);
        Task SaveAsync();
    }
}
