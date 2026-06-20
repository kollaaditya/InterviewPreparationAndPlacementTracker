using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class PlacementDriveService : IPlacementDriveService
    {
        private readonly IPlacementDriveRepository _repo;

        public PlacementDriveService(IPlacementDriveRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<PlacementDrive>> GetAllAsync()
            => await _repo.GetAllAsync();

        public async Task<List<PlacementDrive>> GetByCompanyAsync(int companyId)
            => await _repo.GetByCompanyAsync(companyId);

        public async Task<PlacementDrive?> GetByIdAsync(int id)
            => await _repo.GetByIdAsync(id);

        public async Task<(bool Success, string Message, int DriveId)> CreateAsync(int companyId, CreateDriveRequest request)
        {
            var drive = new PlacementDrive
            {
                CompanyId            = companyId,
                Title                = request.Title,
                Description          = request.Description,
                DriveDate            = request.DriveDate,
                Package              = request.Package,
                EligibilityCriteria  = request.EligibilityCriteria,
                Location             = request.Location,
                Status               = DriveStatus.Active,
                CreatedAt            = DateTime.UtcNow
            };

            await _repo.AddAsync(drive);
            await _repo.SaveAsync();
            return (true, "Placement Drive Created Successfully", drive.DriveId);
        }

        public async Task<(bool Success, string Message)> UpdateAsync(int id, int companyId, UpdateDriveRequest request)
        {
            var drive = await _repo.GetByIdAsync(id);
            if (drive == null)               return (false, "Drive not found");
            if (drive.CompanyId != companyId) return (false, "Unauthorized");

            drive.Title               = request.Title;
            drive.Description         = request.Description;
            drive.DriveDate           = request.DriveDate;
            drive.Package             = request.Package;
            drive.EligibilityCriteria = request.EligibilityCriteria;
            drive.Location            = request.Location;
            drive.Status              = request.Status;

            await _repo.SaveAsync();
            return (true, "Drive Updated Successfully");
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id, int companyId)
        {
            var drive = await _repo.GetByIdAsync(id);
            if (drive == null)               return (false, "Drive not found");
            if (drive.CompanyId != companyId) return (false, "Unauthorized");

            await _repo.DeleteAsync(drive);
            await _repo.SaveAsync();
            return (true, "Drive Deleted Successfully");
        }
    }
}
