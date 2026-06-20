using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class PlacementDriveRepository : IPlacementDriveRepository
    {
        private readonly ApplicationDbContext _context;

        public PlacementDriveRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PlacementDrive>> GetAllAsync()
            => await _context.PlacementDrives
                .Include(d => d.Company)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

        public async Task<List<PlacementDrive>> GetByCompanyAsync(int companyId)
            => await _context.PlacementDrives
                .Where(d => d.CompanyId == companyId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

        public async Task<PlacementDrive?> GetByIdAsync(int id)
            => await _context.PlacementDrives
                .Include(d => d.Company)
                .FirstOrDefaultAsync(d => d.DriveId == id);

        public async Task AddAsync(PlacementDrive drive)
            => await _context.PlacementDrives.AddAsync(drive);

        public Task DeleteAsync(PlacementDrive drive)
        {
            _context.PlacementDrives.Remove(drive);
            return Task.CompletedTask;
        }

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
