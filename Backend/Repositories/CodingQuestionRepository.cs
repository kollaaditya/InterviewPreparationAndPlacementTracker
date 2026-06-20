using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CodingQuestionRepository : ICodingQuestionRepository
    {
        private readonly ApplicationDbContext _context;

        public CodingQuestionRepository(ApplicationDbContext context)
            => _context = context;

        public async Task<List<CodingQuestion>> GetAllAsync()
            => await _context.CodingQuestions.OrderBy(q => q.Difficulty).ToListAsync();

        public async Task<CodingQuestion?> GetByIdAsync(int id)
            => await _context.CodingQuestions.FindAsync(id);

        public async Task AddAsync(CodingQuestion question)
            => await _context.CodingQuestions.AddAsync(question);

        public Task DeleteAsync(CodingQuestion question)
        {
            _context.CodingQuestions.Remove(question);
            return Task.CompletedTask;
        }

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
