using Backend.Models;

namespace Backend.Services
{
    public interface IAptitudeService
    {
        Task<List<AptitudeQuestion>> GetAllQuestionsAsync();
        Task<(bool Success, string Message)> AddQuestionAsync(CreateAptitudeQuestionRequest request);
        Task<(bool Success, string Message)> DeleteQuestionAsync(int id);

        Task<AptitudeResult> SubmitTestAsync(AptitudeSubmitRequest request);
        Task<List<AptitudeResult>> GetResultsAsync(int studentId);
    }
}
