using Backend.Models;

namespace Backend.Services
{
    public interface IApplicationService
    {
        Task<List<Application>> GetByStudentAsync(int studentId);
        Task<List<Application>> GetByDriveAsync(int driveId);
        Task<List<Application>> GetAllAsync();
        Task<(bool Success, string Message)> ApplyAsync(int studentId, int driveId);
        Task<(bool Success, string Message)> UpdateStatusAsync(int applicationId, ApplicationStatus status);
    }
}
