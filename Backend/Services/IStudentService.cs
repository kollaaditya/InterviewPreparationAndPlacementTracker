using Backend.Models;

namespace Backend.Services
{
    public interface IStudentService
    {
        Task<List<Student>> GetAllAsync();
        Task<Student?> GetByIdAsync(int id);
        Task<(bool Success, string Message)> RegisterAsync(Student student);
        Task<Student?> LoginAsync(string email, string password);
        Task<(bool Success, string Message)> UpdateAsync(int id, StudentUpdateRequest request);
        Task<(bool Success, string Message)> UpdateResumeAsync(int id, string resumePath);
        Task<(bool Success, string Message)> DeleteAsync(int id);
    }
}
