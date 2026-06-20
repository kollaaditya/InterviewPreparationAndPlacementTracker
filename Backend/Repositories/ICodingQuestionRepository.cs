using Backend.Models;

namespace Backend.Repositories
{
    public interface ICodingQuestionRepository
    {
        Task<List<CodingQuestion>> GetAllAsync();
        Task<CodingQuestion?> GetByIdAsync(int id);
        Task AddAsync(CodingQuestion question);
        Task DeleteAsync(CodingQuestion question);
        Task SaveAsync();
    }
}
