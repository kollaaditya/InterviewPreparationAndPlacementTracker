using Backend.Models;

namespace Backend.Repositories
{
    public interface IPlacementDriveRepository
    {
        Task<List<PlacementDrive>> GetAllAsync();
        Task<List<PlacementDrive>> GetByCompanyAsync(int companyId);
        Task<PlacementDrive?> GetByIdAsync(int id);
        Task AddAsync(PlacementDrive drive);
        Task DeleteAsync(PlacementDrive drive);
        Task SaveAsync();
    }
}
