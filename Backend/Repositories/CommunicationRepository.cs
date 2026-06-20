using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CommunicationRepository : ICommunicationRepository
    {
        private readonly ApplicationDbContext _context;

        public CommunicationRepository(ApplicationDbContext context)
            => _context = context;

        public async Task<List<CommunicationQuestion>> GetAllQuestionsAsync()
            => await _context.CommunicationQuestions.OrderBy(q => q.Topic).ToListAsync();

        public async Task<CommunicationQuestion?> GetQuestionByIdAsync(int id)
            => await _context.CommunicationQuestions.FindAsync(id);

        public async Task AddQuestionAsync(CommunicationQuestion question)
            => await _context.CommunicationQuestions.AddAsync(question);

        public Task DeleteQuestionAsync(CommunicationQuestion question)
        {
            _context.CommunicationQuestions.Remove(question);
            return Task.CompletedTask;
        }

        public async Task AddResultAsync(CommunicationResult result)
            => await _context.CommunicationResults.AddAsync(result);

        public async Task<List<CommunicationResult>> GetResultsByStudentAsync(int studentId)
            => await _context.CommunicationResults
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.SubmittedDate)
                .ToListAsync();

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
