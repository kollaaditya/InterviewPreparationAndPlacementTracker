using Backend.Models;

namespace Backend.Repositories
{
    public interface ICodeSubmissionRepository
    {
        Task<List<CodeSubmission>> GetByStudentAsync(int studentId);
        Task AddAsync(CodeSubmission submission);
        Task SaveAsync();
    }
}
