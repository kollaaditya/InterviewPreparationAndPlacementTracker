using Backend.Models;

namespace Backend.Services
{
    public interface ICommunicationService
    {
        Task<List<CommunicationQuestion>> GetAllQuestionsAsync();
        Task<(bool Success, string Message)> AddQuestionAsync(CreateCommunicationQuestionRequest request);
        Task<(bool Success, string Message)> DeleteQuestionAsync(int id);

        Task<CommunicationResult> SubmitTestAsync(CommunicationSubmitRequest request);
        Task<List<CommunicationResult>> GetResultsAsync(int studentId);
    }
}
