using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<JobApplication>> GetAllAsync() =>
            await _context.JobApplications
                .Include(a => a.Student)
                .Include(a => a.Job).ThenInclude(j => j!.Company)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();

        public async Task<JobApplication?> GetByIdAsync(int id) =>
            await _context.JobApplications
                .Include(a => a.Student)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.ApplicationId == id);

        public async Task<List<JobApplication>> GetByStudentAsync(int studentId) =>
            await _context.JobApplications
                .Include(a => a.Job).ThenInclude(j => j!.Company)
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();

        public async Task<List<JobApplication>> GetByJobAsync(int jobId) =>
            await _context.JobApplications
                .Include(a => a.Student)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();

        public async Task<bool> ExistsAsync(int studentId, int jobId) =>
            await _context.JobApplications.AnyAsync(a => a.StudentId == studentId && a.JobId == jobId);

        public async Task AddAsync(JobApplication application) =>
            await _context.JobApplications.AddAsync(application);

        public async Task SaveAsync() =>
            await _context.SaveChangesAsync();
    }
}
