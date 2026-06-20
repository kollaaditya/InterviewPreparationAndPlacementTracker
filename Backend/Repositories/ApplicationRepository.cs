using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public ApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Application>> GetByStudentAsync(int studentId)
            => await _context.Applications
                .Include(a => a.PlacementDrive).ThenInclude(d => d!.Company)
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

        public async Task<List<Application>> GetByDriveAsync(int driveId)
            => await _context.Applications
                .Include(a => a.Student)
                .Where(a => a.DriveId == driveId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

        public async Task<List<Application>> GetAllAsync()
            => await _context.Applications
                .Include(a => a.Student)
                .Include(a => a.PlacementDrive).ThenInclude(d => d!.Company)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();

        public async Task<Application?> GetByIdAsync(int id)
            => await _context.Applications
                .Include(a => a.Student)
                .Include(a => a.PlacementDrive)
                .FirstOrDefaultAsync(a => a.ApplicationId == id);

        public async Task<bool> ExistsAsync(int studentId, int driveId)
            => await _context.Applications.AnyAsync(a => a.StudentId == studentId && a.DriveId == driveId);

        public async Task AddAsync(Application application)
            => await _context.Applications.AddAsync(application);

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
