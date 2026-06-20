using Backend.Models;
using Backend.Repositories;

namespace Backend.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _repo;

        public CompanyService(ICompanyRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Company>> GetAllAsync()
            => await _repo.GetAllAsync();

        public async Task<Company?> GetByIdAsync(int id)
            => await _repo.GetByIdAsync(id);

        public async Task<(bool Success, string Message)> RegisterAsync(Company company)
        {
            if (await _repo.GetByEmailAsync(company.Email) != null)
                return (false, "Email already exists");

            company.Role = UserRole.Company;
            await _repo.AddAsync(company);
            await _repo.SaveAsync();
            return (true, "Company Registered Successfully");
        }

        public async Task<Company?> LoginAsync(string email, string password)
            => await _repo.GetByEmailAndPasswordAsync(email, password);

        public async Task<(bool Success, string Message)> UpdateAsync(int id, CompanyUpdateRequest request)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null) return (false, "Company not found");

            company.CompanyName          = request.CompanyName;
            company.Package              = request.Package;
            company.EligibilityCriteria  = request.EligibilityCriteria;
            company.JobDescription       = request.JobDescription;

            await _repo.SaveAsync();
            return (true, "Company Updated Successfully");
        }

        public async Task<(bool Success, string Message)> DeleteAsync(int id)
        {
            var company = await _repo.GetByIdAsync(id);
            if (company == null) return (false, "Company not found");

            await _repo.DeleteAsync(company);
            await _repo.SaveAsync();
            return (true, "Company Deleted Successfully");
        }

        public async Task<List<Student>> GetEligibleStudentsAsync(int companyId)
        {
            var company = await _repo.GetByIdAsync(companyId);
            if (company == null) return new List<Student>();

            // Parse min CGPA from EligibilityCriteria (format: "CGPA>=7.0,Skills:Java")
            decimal minCGPA = 0;
            string requiredSkill = "";

            if (!string.IsNullOrWhiteSpace(company.EligibilityCriteria))
            {
                var parts = company.EligibilityCriteria.Split(',');
                foreach (var part in parts)
                {
                    var p = part.Trim();
                    if (p.StartsWith("CGPA>=", StringComparison.OrdinalIgnoreCase))
                        decimal.TryParse(p[6..], out minCGPA);
                    else if (p.StartsWith("Skills:", StringComparison.OrdinalIgnoreCase))
                        requiredSkill = p[7..].Trim();
                }
            }

            return await _repo.GetEligibleStudentsAsync(minCGPA, requiredSkill);
        }
    }
}
