using Backend.Models;

namespace Backend.Services
{
    public interface IPlacementDriveService
    {
        Task<List<PlacementDrive>> GetAllAsync();
        Task<List<PlacementDrive>> GetByCompanyAsync(int companyId);
        Task<PlacementDrive?> GetByIdAsync(int id);
        Task<(bool Success, string Message, int DriveId)> CreateAsync(int companyId, CreateDriveRequest request);
        Task<(bool Success, string Message)> UpdateAsync(int id, int companyId, UpdateDriveRequest request);
        Task<(bool Success, string Message)> DeleteAsync(int id, int companyId);
    }
}
