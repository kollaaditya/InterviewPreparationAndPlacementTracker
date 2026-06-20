using Backend.Models;

namespace Backend.Services
{
    public interface ICompanyService
    {
        Task<List<Company>> GetAllAsync();
        Task<Company?> GetByIdAsync(int id);
        Task<(bool Success, string Message)> RegisterAsync(Company company);
        Task<Company?> LoginAsync(string email, string password);
        Task<(bool Success, string Message)> UpdateAsync(int id, CompanyUpdateRequest request);
        Task<(bool Success, string Message)> DeleteAsync(int id);
        Task<List<Student>> GetEligibleStudentsAsync(int companyId);
    }
}
