using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _repo;

        public AdminService(IAdminRepository repo)
        {
            _repo = repo;
        }

        public async Task<Admin?> LoginAsync(string username, string password)
            => await _repo.GetByUsernameAndPasswordAsync(username, password);

        public async Task<object> GetStatsAsync()
        {
            return new
            {
                totalStudents  = await _repo.GetStudentCountAsync(),
                totalCompanies = await _repo.GetCompanyCountAsync(),
                avgCGPA        = Math.Round(await _repo.GetAvgCGPAAsync(), 2),
                highCGPA       = await _repo.GetHighCGPACountAsync(),
                withResume     = await _repo.GetWithResumeCountAsync(),
                maxPackage     = await _repo.GetMaxPackageAsync(),
                avgPackage     = Math.Round(await _repo.GetAvgPackageAsync(), 2)
            };
        }

        public async Task<object> GetReportsAsync()
        {
            var students  = await _repo.GetAllStudentsAsync();
            var companies = await _repo.GetAllCompaniesAsync();

            // CGPA distribution buckets
            var cgpaDist = new
            {
                below6  = students.Count(s => s.CGPA < 6),
                from6to7 = students.Count(s => s.CGPA >= 6 && s.CGPA < 7),
                from7to8 = students.Count(s => s.CGPA >= 7 && s.CGPA < 8),
                above8   = students.Count(s => s.CGPA >= 8)
            };

            // Top 5 skills
            var skillFreq = students
                .Where(s => !string.IsNullOrWhiteSpace(s.Skills))
                .SelectMany(s => s.Skills.Split(',').Select(sk => sk.Trim().ToLower()))
                .Where(sk => sk.Length > 0)
                .GroupBy(sk => sk)
                .OrderByDescending(g => g.Count())
                .Take(5)
                .Select(g => new { skill = g.Key, count = g.Count() })
                .ToList();

            // Branch distribution
            var branchDist = students
                .GroupBy(s => s.Branch)
                .Select(g => new { branch = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .Take(6)
                .ToList();

            // Package ranges
            var pkgDist = new
            {
                below5   = companies.Count(c => c.Package < 5),
                from5to10 = companies.Count(c => c.Package >= 5 && c.Package < 10),
                from10to15 = companies.Count(c => c.Package >= 10 && c.Package < 15),
                above15  = companies.Count(c => c.Package >= 15)
            };

            return new
            {
                cgpaDistribution    = cgpaDist,
                topSkills           = skillFreq,
                branchDistribution  = branchDist,
                packageDistribution = pkgDist,
                totalStudents       = students.Count,
                totalCompanies      = companies.Count,
                studentsWithResume  = students.Count(s => !string.IsNullOrWhiteSpace(s.ResumePath)),
                avgCGPA             = students.Count > 0 ? Math.Round(students.Average(s => s.CGPA), 2) : 0
            };
        }
    }
}
