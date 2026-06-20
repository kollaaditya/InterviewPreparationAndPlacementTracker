using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public AdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Admin?> GetByUsernameAndPasswordAsync(string username, string password)
            => await _context.Admins.FirstOrDefaultAsync(a => a.Username == username && a.Password == password);

        public async Task<int>     GetStudentCountAsync()     => await _context.students.CountAsync();
        public async Task<int>     GetCompanyCountAsync()     => await _context.companies.CountAsync();
        public async Task<decimal> GetAvgCGPAAsync()          => await _context.students.AnyAsync()
                                                                    ? await _context.students.AverageAsync(s => s.CGPA) : 0;
        public async Task<int>     GetHighCGPACountAsync()    => await _context.students.CountAsync(s => s.CGPA >= 8);
        public async Task<int>     GetWithResumeCountAsync()  => await _context.students.CountAsync(s => s.ResumePath != "");
        public async Task<decimal> GetMaxPackageAsync()       => await _context.companies.AnyAsync()
                                                                    ? await _context.companies.MaxAsync(c => c.Package) : 0;
        public async Task<decimal> GetAvgPackageAsync()       => await _context.companies.AnyAsync()
                                                                    ? await _context.companies.AverageAsync(c => c.Package) : 0;
        public async Task<List<Student>> GetAllStudentsAsync()  => await _context.students.ToListAsync();
        public async Task<List<Company>> GetAllCompaniesAsync() => await _context.companies.ToListAsync();
    }
}
