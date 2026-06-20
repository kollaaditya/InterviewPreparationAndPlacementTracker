using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repo;

        public StudentService(IStudentRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Student>> GetAllAsync()
            => await _repo.GetAllAsync();

        public async Task<Student?> GetByIdAsync(int id)
            => await _repo.GetByIdAsync(id);

        public async Task<(bool Success, string Message)> RegisterAsync(Student student)
        {
            if (await _repo.GetByEmailAsync(student.Email) != null)
                return (false, "Email already exists");

            student.Role = UserRole.Student;
            await _repo.AddAsync(student);
            await _repo.SaveAsync();
            return (true, "Student Registered Successfully");
        }

        public async Task<Student?> LoginAsync(string email, string password)
            => await _repo.GetByEmailAndPasswordAsync(email, password);

        public async Task<(bool Success, string Message)> UpdateAsync(int id, StudentUpdateRequest request)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null)
                return (false, "Student not found");

            student.FullName = request.FullName;
            student.Phone = request.Phone;
            student.College = request.College;
            student.Branch = request.Branch;
            student.CGPA = request.CGPA;
            student.Skills = request.Skills;

            await _repo.SaveAsync();
            return (true, "Student Updated Successfully");
        }

        public async Task<(bool Success, string Message)> UpdateResumeAsync(int id, string resumePath)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null)
                return (false, "Student not found");

            student.ResumePath = resumePath;
            await _repo.SaveAsync();
            return (true, "Resume Uploaded Successfully");
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null)
                return (false, "Student not found");

            await _repo.DeleteAsync(student);
            await _repo.SaveAsync();
            return (true, "Student Deleted Successfully");
        }
    }
}
