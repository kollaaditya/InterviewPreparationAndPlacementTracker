using Backend.Models;

namespace Backend.Repositories
{
    public interface ICommunicationRepository
    {
        Task<List<CommunicationQuestion>> GetAllQuestionsAsync();
        Task<CommunicationQuestion?> GetQuestionByIdAsync(int id);
        Task AddQuestionAsync(CommunicationQuestion question);
        Task DeleteQuestionAsync(CommunicationQuestion question);

        Task AddResultAsync(CommunicationResult result);
        Task<List<CommunicationResult>> GetResultsByStudentAsync(int studentId);

        Task SaveAsync();
    }
}
