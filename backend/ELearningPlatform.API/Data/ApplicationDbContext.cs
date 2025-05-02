using ELearningPlatform.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ELearningPlatform.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
        public DbSet<UserQuiz> UserQuizzes { get; set; }
        public DbSet<UserExam> UserExams { get; set; }

        // Gamification
        public DbSet<Badge> Badges { get; set; }
        public DbSet<UserBadge> UserBadges { get; set; }
        public DbSet<CodingGame> CodingGames { get; set; }
        public DbSet<UserCodingGame> UserCodingGames { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // UserCourse
            builder.Entity<UserCourse>()
                .HasKey(uc => new { uc.UserId, uc.CourseId });

            builder.Entity<UserCourse>()
                .Property(uc => uc.UserId).HasMaxLength(450);
            builder.Entity<UserCourse>()
                .Property(uc => uc.CourseId).HasMaxLength(450);

            builder.Entity<UserCourse>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCourses)
                .HasForeignKey(uc => uc.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserCourse>()
                .HasOne(uc => uc.Course)
                .WithMany(c => c.UserCourses)
                .HasForeignKey(uc => uc.CourseId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserQuiz
            builder.Entity<UserQuiz>()
                .HasKey(uq => new { uq.UserId, uq.QuizId });

            builder.Entity<UserQuiz>()
                .Property(uq => uq.UserId).HasMaxLength(450);
            builder.Entity<UserQuiz>()
                .Property(uq => uq.QuizId).HasMaxLength(450);

            builder.Entity<UserQuiz>()
                .HasOne(uq => uq.User)
                .WithMany(u => u.UserQuizzes)
                .HasForeignKey(uq => uq.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserQuiz>()
                .HasOne(uq => uq.Quiz)
                .WithMany()
                .HasForeignKey(uq => uq.QuizId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserExam
            builder.Entity<UserExam>()
                .HasKey(ue => new { ue.UserId, ue.ExamId });

            builder.Entity<UserExam>()
                .Property(ue => ue.UserId).HasMaxLength(450);
            builder.Entity<UserExam>()
                .Property(ue => ue.ExamId).HasMaxLength(450);

            builder.Entity<UserExam>()
                .HasOne(ue => ue.User)
                .WithMany(u => u.UserExams)
                .HasForeignKey(ue => ue.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserExam>()
                .HasOne(ue => ue.Exam)
                .WithMany()
                .HasForeignKey(ue => ue.ExamId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserBadge
            builder.Entity<UserBadge>()
                .HasKey(ub => new { ub.UserId, ub.BadgeId });

            builder.Entity<UserBadge>()
                .HasOne(ub => ub.User)
                .WithMany(u => u.UserBadges)
                .HasForeignKey(ub => ub.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserBadge>()
                .HasOne(ub => ub.Badge)
                .WithMany()
                .HasForeignKey(ub => ub.BadgeId)
                .OnDelete(DeleteBehavior.Restrict);

            // UserCodingGame
            builder.Entity<UserCodingGame>()
                .HasKey(ucg => new { ucg.UserId, ucg.CodingGameId });

            builder.Entity<UserCodingGame>()
                .HasOne(ucg => ucg.User)
                .WithMany(u => u.UserCodingGames)
                .HasForeignKey(ucg => ucg.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserCodingGame>()
                .HasOne(ucg => ucg.CodingGame)
                .WithMany()
                .HasForeignKey(ucg => ucg.CodingGameId)
                .OnDelete(DeleteBehavior.Restrict);

            // Course -> Modules
            builder.Entity<Course>()
                .HasMany(c => c.Modules)
                .WithOne(m => m.Course)
                .OnDelete(DeleteBehavior.Cascade);

            // Module -> Lessons
            builder.Entity<Module>()
                .HasMany(m => m.Lessons)
                .WithOne(l => l.Module)
                .OnDelete(DeleteBehavior.Cascade);

            // Course -> Quizzes
            builder.Entity<Course>()
                .HasMany(c => c.Quizzes)
                .WithOne(q => q.Course)
                .OnDelete(DeleteBehavior.Cascade);

            // Quiz -> Questions
            builder.Entity<Quiz>()
                .HasMany(q => q.Questions)
                .WithOne(q => q.Quiz)
                .OnDelete(DeleteBehavior.Cascade);

            // Question -> Answers
            builder.Entity<Question>()
                .HasMany(q => q.Answers)
                .WithOne(a => a.Question)
                .OnDelete(DeleteBehavior.Cascade);

            // Certificate -> Course (no cascade)
            builder.Entity<Certificate>()
                .HasOne(c => c.Course)
                .WithMany()
                .HasForeignKey(c => c.CourseId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
