using Backend.Models;

namespace Backend.Repositories
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllAsync();
        Task<Job?> GetByIdAsync(int id);
        Task<List<Job>> GetByCompanyIdAsync(int companyId);
        Task AddAsync(Job job);
        Task UpdateAsync(Job job);
        Task DeleteAsync(Job job);
        Task SaveAsync();
    }
}
