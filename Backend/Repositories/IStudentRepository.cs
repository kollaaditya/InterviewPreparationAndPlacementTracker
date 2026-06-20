using Backend.Models;

namespace Backend.Repositories
{
    public interface IStudentRepository
    {
        Task<List<Student>> GetAllAsync();
        Task<Student?> GetByIdAsync(int id);
        Task<Student?> GetByEmailAsync(string email);
        Task<Student?> GetByEmailAndPasswordAsync(string email, string password);
        Task AddAsync(Student student);
        Task DeleteAsync(Student student);
        Task SaveAsync();
    }
}
