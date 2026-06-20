using Backend.Models;

namespace Backend.Repositories
{
    public interface ICompanyRepository
    {
        Task<List<Company>> GetAllAsync();
        Task<Company?> GetByIdAsync(int id);
        Task<Company?> GetByEmailAsync(string email);
        Task<Company?> GetByEmailAndPasswordAsync(string email, string password);
        Task<List<Student>> GetEligibleStudentsAsync(decimal minCGPA, string requiredSkill);
        Task AddAsync(Company company);
        Task DeleteAsync(Company company);
        Task SaveAsync();
    }
}
