using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AptitudeRepository : IAptitudeRepository
    {
        private readonly ApplicationDbContext _context;

        public AptitudeRepository(ApplicationDbContext context)
            => _context = context;

        public async Task<List<AptitudeQuestion>> GetAllQuestionsAsync()
            => await _context.AptitudeQuestions.OrderBy(q => q.Category).ToListAsync();

        public async Task<AptitudeQuestion?> GetQuestionByIdAsync(int id)
            => await _context.AptitudeQuestions.FindAsync(id);

        public async Task AddQuestionAsync(AptitudeQuestion question)
            => await _context.AptitudeQuestions.AddAsync(question);

        public Task DeleteQuestionAsync(AptitudeQuestion question)
        {
            _context.AptitudeQuestions.Remove(question);
            return Task.CompletedTask;
        }

        public async Task AddResultAsync(AptitudeResult result)
            => await _context.AptitudeResults.AddAsync(result);

        public async Task<List<AptitudeResult>> GetResultsByStudentAsync(int studentId)
            => await _context.AptitudeResults
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.SubmittedDate)
                .ToListAsync();

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
