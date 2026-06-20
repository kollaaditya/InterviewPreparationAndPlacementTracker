using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class CommunicationService : ICommunicationService
    {
        private readonly ICommunicationRepository _repo;

        public CommunicationService(ICommunicationRepository repo)
            => _repo = repo;

        public async Task<List<CommunicationQuestion>> GetAllQuestionsAsync()
            => await _repo.GetAllQuestionsAsync();

        public async Task<(bool Success, string Message)> AddQuestionAsync(CreateCommunicationQuestionRequest req)
        {
            var q = new CommunicationQuestion
            {
                QuestionText  = req.QuestionText,
                OptionA       = req.OptionA,
                OptionB       = req.OptionB,
                OptionC       = req.OptionC,
                OptionD       = req.OptionD,
                CorrectAnswer = req.CorrectAnswer.ToUpper(),
                Topic         = req.Topic,
                CreatedAt     = DateTime.UtcNow
            };
            await _repo.AddQuestionAsync(q);
            await _repo.SaveAsync();
            return (true, "Question added successfully");
        }

        public async Task<(bool Success, string Message)> DeleteQuestionAsync(int id)
        {
            var q = await _repo.GetQuestionByIdAsync(id);
            if (q == null) return (false, "Question not found");
            await _repo.DeleteQuestionAsync(q);
            await _repo.SaveAsync();
            return (true, "Question deleted");
        }

        public async Task<CommunicationResult> SubmitTestAsync(CommunicationSubmitRequest req)
        {
            var questions = await _repo.GetAllQuestionsAsync();
            var qMap      = questions.ToDictionary(q => q.QuestionId);

            int score = req.Answers.Count(a =>
                qMap.ContainsKey(a.QuestionId) &&
                qMap[a.QuestionId].CorrectAnswer.Equals(a.SelectedOption, StringComparison.OrdinalIgnoreCase));

            var result = new CommunicationResult
            {
                StudentId      = req.StudentId,
                Score          = score,
                TotalQuestions = req.Answers.Count,
                SubmittedDate  = DateTime.UtcNow
            };

            await _repo.AddResultAsync(result);
            await _repo.SaveAsync();
            return result;
        }

        public async Task<List<CommunicationResult>> GetResultsAsync(int studentId)
            => await _repo.GetResultsByStudentAsync(studentId);
    }
}
