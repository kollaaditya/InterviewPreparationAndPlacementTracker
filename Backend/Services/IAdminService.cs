using Backend.Models;

namespace Backend.Services
{
    public interface IAdminService
    {
        Task<Admin?> LoginAsync(string username, string password);
        Task<object> GetStatsAsync();
        Task<object> GetReportsAsync();
    }
}
