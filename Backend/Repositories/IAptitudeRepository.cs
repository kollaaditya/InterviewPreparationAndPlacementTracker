using Backend.Models;

namespace Backend.Repositories
{
    public interface IAptitudeRepository
    {
        Task<List<AptitudeQuestion>> GetAllQuestionsAsync();
        Task<AptitudeQuestion?> GetQuestionByIdAsync(int id);
        Task AddQuestionAsync(AptitudeQuestion question);
        Task DeleteQuestionAsync(AptitudeQuestion question);

        Task AddResultAsync(AptitudeResult result);
        Task<List<AptitudeResult>> GetResultsByStudentAsync(int studentId);

        Task SaveAsync();
    }
}
