using Backend.Models;

namespace Backend.Repositories
{
    public interface IAdminRepository
    {
        Task<Admin?> GetByUsernameAndPasswordAsync(string username, string password);
        Task<int>     GetStudentCountAsync();
        Task<int>     GetCompanyCountAsync();
        Task<decimal> GetAvgCGPAAsync();
        Task<int>     GetHighCGPACountAsync();
        Task<int>     GetWithResumeCountAsync();
        Task<decimal> GetMaxPackageAsync();
        Task<decimal> GetAvgPackageAsync();
        Task<List<Student>> GetAllStudentsAsync();
        Task<List<Company>> GetAllCompaniesAsync();
    }
}
