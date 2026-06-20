using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly ApplicationDbContext _context;

        public JobRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Job>> GetAllAsync() =>
            await _context.Jobs.Include(j => j.Company).ToListAsync();

        public async Task<Job?> GetByIdAsync(int id) =>
            await _context.Jobs.Include(j => j.Company).FirstOrDefaultAsync(j => j.JobId == id);

        public async Task<List<Job>> GetByCompanyIdAsync(int companyId) =>
            await _context.Jobs.Where(j => j.CompanyId == companyId).ToListAsync();

        public async Task AddAsync(Job job) =>
            await _context.Jobs.AddAsync(job);

        public Task UpdateAsync(Job job)
        {
            _context.Jobs.Update(job);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(Job job)
        {
            _context.Jobs.Remove(job);
            return Task.CompletedTask;
        }

        public async Task SaveAsync() =>
            await _context.SaveChangesAsync();
    }
}
