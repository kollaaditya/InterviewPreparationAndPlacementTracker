using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class CodingService : ICodingService
    {
        private readonly ICodingQuestionRepository  _questionRepo;
        private readonly ICodeSubmissionRepository  _submissionRepo;
        private readonly CodingExecutionService     _executor;

        public CodingService(
            ICodingQuestionRepository  questionRepo,
            ICodeSubmissionRepository  submissionRepo,
            CodingExecutionService     executor)
        {
            _questionRepo   = questionRepo;
            _submissionRepo = submissionRepo;
            _executor       = executor;
        }

        public async Task<List<CodingQuestion>> GetAllQuestionsAsync()
            => await _questionRepo.GetAllAsync();

        public async Task<CodingQuestion?> GetQuestionByIdAsync(int id)
            => await _questionRepo.GetByIdAsync(id);

        public async Task<(bool Success, string Message)> CreateQuestionAsync(CreateCodingQuestionRequest req)
        {
            var q = new CodingQuestion
            {
                Title        = req.Title,
                Description  = req.Description,
                InputFormat  = req.InputFormat,
                OutputFormat = req.OutputFormat,
                SampleInput  = req.SampleInput,
                SampleOutput = req.SampleOutput,
                Difficulty   = req.Difficulty,
                Language     = req.Language,
                CreatedAt    = DateTime.UtcNow
            };
            await _questionRepo.AddAsync(q);
            await _questionRepo.SaveAsync();
            return (true, "Question added successfully");
        }

        public async Task<(bool Success, string Message)> DeleteQuestionAsync(int id)
        {
            var q = await _questionRepo.GetByIdAsync(id);
            if (q == null) return (false, "Question not found");
            await _questionRepo.DeleteAsync(q);
            await _questionRepo.SaveAsync();
            return (true, "Question deleted successfully");
        }

        public async Task<string> RunCodeAsync(RunCodeRequest req)
        {
            var (output, _) = await _executor.ExecuteAsync(req.SourceCode, req.LanguageId);
            return output;
        }

        public async Task<CodeSubmission> SubmitCodeAsync(SubmitCodeRequest req)
        {
            var (output, status) = await _executor.ExecuteAsync(req.SourceCode, req.LanguageId);

            var submission = new CodeSubmission
            {
                StudentId   = req.StudentId,
                QuestionId  = req.QuestionId,
                Language    = req.Language,
                SourceCode  = req.SourceCode,
                Output      = output,
                Status      = status,
                SubmittedAt = DateTime.UtcNow
            };

            await _submissionRepo.AddAsync(submission);
            await _submissionRepo.SaveAsync();
            return submission;
        }

        public async Task<List<CodeSubmission>> GetSubmissionsAsync(int studentId)
            => await _submissionRepo.GetByStudentAsync(studentId);
    }
}
