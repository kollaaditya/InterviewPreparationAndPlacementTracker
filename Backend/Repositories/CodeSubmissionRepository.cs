using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CodeSubmissionRepository : ICodeSubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public CodeSubmissionRepository(ApplicationDbContext context)
            => _context = context;

        public async Task<List<CodeSubmission>> GetByStudentAsync(int studentId)
            => await _context.CodeSubmissions
                .Include(s => s.CodingQuestion)
                .Where(s => s.StudentId == studentId)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();

        public async Task AddAsync(CodeSubmission submission)
            => await _context.CodeSubmissions.AddAsync(submission);

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
