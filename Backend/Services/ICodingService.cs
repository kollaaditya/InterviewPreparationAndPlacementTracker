using Backend.Models;

namespace Backend.Services
{
    public interface ICodingService
    {
        Task<List<CodingQuestion>> GetAllQuestionsAsync();
        Task<CodingQuestion?> GetQuestionByIdAsync(int id);
        Task<(bool Success, string Message)> CreateQuestionAsync(CreateCodingQuestionRequest request);
        Task<(bool Success, string Message)> DeleteQuestionAsync(int id);

        Task<string> RunCodeAsync(RunCodeRequest request);
        Task<CodeSubmission> SubmitCodeAsync(SubmitCodeRequest request);
        Task<List<CodeSubmission>> GetSubmissionsAsync(int studentId);
    }
}
