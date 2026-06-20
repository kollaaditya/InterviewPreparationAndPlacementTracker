using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ApplicationDbContext _context;

        public CompanyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Company>> GetAllAsync()
            => await _context.companies.ToListAsync();

        public async Task<Company?> GetByIdAsync(int id)
            => await _context.companies.FindAsync(id);

        public async Task<Company?> GetByEmailAsync(string email)
            => await _context.companies.FirstOrDefaultAsync(c => c.Email == email);

        public async Task<Company?> GetByEmailAndPasswordAsync(string email, string password)
            => await _context.companies.FirstOrDefaultAsync(c => c.Email == email && c.Password == password);

        public async Task<List<Student>> GetEligibleStudentsAsync(decimal minCGPA, string requiredSkill)
        {
            var query = _context.students.Where(s => s.CGPA >= minCGPA);

            if (!string.IsNullOrWhiteSpace(requiredSkill))
                query = query.Where(s => s.Skills.ToLower().Contains(requiredSkill.ToLower()));

            return await query.ToListAsync();
        }

        public async Task AddAsync(Company company)
            => await _context.companies.AddAsync(company);

        public Task DeleteAsync(Company company)
        {
            _context.companies.Remove(company);
            return Task.CompletedTask;
        }

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
