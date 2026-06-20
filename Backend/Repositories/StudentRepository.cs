using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly ApplicationDbContext _context;

        public StudentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Student>> GetAllAsync()
            => await _context.students.ToListAsync();

        public async Task<Student?> GetByIdAsync(int id)
            => await _context.students.FindAsync(id);

        public async Task<Student?> GetByEmailAsync(string email)
            => await _context.students.FirstOrDefaultAsync(s => s.Email == email);

        public async Task<Student?> GetByEmailAndPasswordAsync(string email, string password)
            => await _context.students.FirstOrDefaultAsync(s => s.Email == email && s.Password == password);

        public async Task AddAsync(Student student)
            => await _context.students.AddAsync(student);

        public Task DeleteAsync(Student student)
        {
            _context.students.Remove(student);
            return Task.CompletedTask;
        }

        public async Task SaveAsync()
            => await _context.SaveChangesAsync();
    }
}
