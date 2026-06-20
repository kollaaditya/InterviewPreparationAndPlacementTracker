using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Student>        students        { get; set; }
        public DbSet<Company>        companies       { get; set; }
        public DbSet<Admin>          Admins          { get; set; }
        public DbSet<Job>            Jobs            { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<PlacementDrive> PlacementDrives { get; set; }
        public DbSet<Application>    Applications    { get; set; }

        // ── New Assessment Modules ──────────────────────────────────────────
        public DbSet<CodingQuestion>      CodingQuestions      { get; set; }
        public DbSet<CodeSubmission>      CodeSubmissions      { get; set; }
        public DbSet<AptitudeQuestion>    AptitudeQuestions    { get; set; }
        public DbSet<AptitudeResult>      AptitudeResults      { get; set; }
        public DbSet<CommunicationQuestion> CommunicationQuestions { get; set; }
        public DbSet<CommunicationResult>   CommunicationResults   { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // One student can apply to a job only once
            modelBuilder.Entity<JobApplication>()
                .HasIndex(a => new { a.StudentId, a.JobId })
                .IsUnique();
        }
    }
}
