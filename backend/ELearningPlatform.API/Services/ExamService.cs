using ELearningPlatform.API.Data;
using ELearningPlatform.API.DTOs;
using ELearningPlatform.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ELearningPlatform.API.Services
{
    public class ExamService : IExamService
    {
        private readonly ApplicationDbContext _context;

        public ExamService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExamDto>> GetExamsByCourseIdAsync(int courseId)
        {
            var exams = await _context.Exams
                .Include(e => e.Questions)
                .Where(e => e.CourseId == courseId)
                .ToListAsync();

            return exams.Select(e => new ExamDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                CourseId = e.CourseId,
                TimeLimit = e.TimeLimit,
                PassingScore = e.PassingScore,
                PointsToEarn = e.PointsToEarn,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                IsFinal = e.IsFinal,
                QuestionsCount = e.Questions.Count
            });
        }

        public async Task<ExamDto> GetExamByIdAsync(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null) return null;

            return new ExamDto
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                CourseId = exam.CourseId,
                TimeLimit = exam.TimeLimit,
                PassingScore = exam.PassingScore,
                PointsToEarn = exam.PointsToEarn,
                StartDate = exam.StartDate,
                EndDate = exam.EndDate,
                IsFinal = exam.IsFinal,
                QuestionsCount = exam.Questions.Count,
                Questions = exam.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Points = q.Points,
                    Type = q.Type.ToString(),
                    Answers = q.Answers.Select(a => new AnswerDto
                    {
                        Id = a.Id,
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<Exam> CreateExamAsync(CreateExamDto examDto)
        {
            var exam = new Exam
            {
                Title = examDto.Title,
                Description = examDto.Description,
                CourseId = examDto.CourseId,
                TimeLimit = examDto.TimeLimit,
                PassingScore = examDto.PassingScore,
                PointsToEarn = examDto.PointsToEarn,
                StartDate = examDto.StartDate,
                EndDate = examDto.EndDate,
                IsFinal = examDto.IsFinal
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<Exam> UpdateExamAsync(int id, UpdateExamDto examDto)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return null;

            exam.Title = examDto.Title ?? exam.Title;
            exam.Description = examDto.Description ?? exam.Description;
            exam.TimeLimit = examDto.TimeLimit ?? exam.TimeLimit;
            exam.PassingScore = examDto.PassingScore ?? exam.PassingScore;
            exam.PointsToEarn = examDto.PointsToEarn ?? exam.PointsToEarn;
            exam.StartDate = examDto.StartDate ?? exam.StartDate;
            exam.EndDate = examDto.EndDate ?? exam.EndDate;
            exam.IsFinal = examDto.IsFinal ?? exam.IsFinal;
            exam.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return exam;
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            var exam = await _context.Exams.Include(e => e.Questions).FirstOrDefaultAsync(e => e.Id == id);
            if (exam == null) return false;
            
            _context.Questions.RemoveRange(exam.Questions);
            _context.Exams.Remove(exam);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<ExamResultDto> SubmitExamAsync(int examId, string userId, SubmitExamDto submitExamDto)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(e => e.Id == examId);

            if (exam == null) return null;

            // Check if exam is active
            var now = DateTime.UtcNow;
            if (now < exam.StartDate || now > exam.EndDate)
            {
                return new ExamResultDto
                {
                    ExamId = examId,
                    ExamTitle = exam.Title,
                    UserId = userId,
                    Score = 0,
                    IsPassed = false,
                    PointsEarned = 0,
                    StartTime = submitExamDto.StartTime,
                    EndTime = now,
                    Message = "Exam is not active"
                };
            }

            // Calculate score
            int totalPoints = exam.Questions.Sum(q => q.Points);
            int earnedPoints = 0;

            foreach (var answer in submitExamDto.Answers)
            {
                var question = exam.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null) continue;

                if (question.Type == QuestionType.MultipleChoice || question.Type == QuestionType.TrueFalse)
                {
                    var correctAnswers = question.Answers.Where(a => a.IsCorrect).Select(a => a.Id).ToList();
                    var userAnswers = answer.AnswerIds;

                    if (correctAnswers.Count == userAnswers.Count && 
                        correctAnswers.All(a => userAnswers.Contains(a)))
                    {
                        earnedPoints += question.Points;
                    }
                }
                else if (question.Type == QuestionType.ShortAnswer)
                {
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect)?.Text;
                    if (correctAnswer != null && correctAnswer.Equals(answer.TextAnswer, StringComparison.OrdinalIgnoreCase))
                    {
                        earnedPoints += question.Points;
                    }
                }
                // For essay and coding questions, we would need manual grading
            }

            int scorePercentage = totalPoints > 0 ? (earnedPoints * 100) / totalPoints : 0;
            bool isPassed = scorePercentage >= exam.PassingScore;
            int pointsEarned = isPassed ? exam.PointsToEarn : 0;

            // Check if user has already taken this exam
            var userExam = await _context.UserExams
                .FirstOrDefaultAsync(ue => ue.UserId == userId && ue.ExamId == examId);

            if (userExam == null)
            {
                userExam = new UserExam
                {
                    UserId = userId,
                    ExamId = examId,
                    StartTime = submitExamDto.StartTime,
                    EndTime = now,
                    Score = scorePercentage,
                    IsPassed = isPassed,
                    PointsEarned = pointsEarned
                };
                _context.UserExams.Add(userExam);
            }
            else
            {
                // For exams, we typically don't allow retakes, but we could update if needed
                userExam.EndTime = now;
                userExam.Score = scorePercentage;
                userExam.IsPassed = isPassed;
                userExam.PointsEarned = pointsEarned;
            }

            // Update user points if passed
            if (isPassed)
            {
                var user = await _context.Users.FindAsync(userId);
                if (user != null)
                {
                    user.Points += pointsEarned;
                    // Update level based on points
                    user.Level = (user.Points / 100) + 1; // Simple level calculation

                    // If it's a final exam and passed, create a certificate
                    if (exam.IsFinal)
                    {
                        var course = await _context.Courses.FindAsync(exam.CourseId);
                        if (course != null)
                        {
                            var certificate = new Certificate
                            {
                                Title = $"Certificate of Completion - {course.Title}",
                                Description = $"This certifies that the student has successfully completed the course {course.Title}",
                                UserId = userId,
                                CourseId = course.Id,
                                IssuedDate = now,
                                CertificateUrl = $"/certificates/{course.Id}_{userId}_{now.Ticks}.pdf" // Placeholder URL
                            };
                            _context.Certificates.Add(certificate);

                            // Mark course as completed
                            var userCourse = await _context.UserCourses
                                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == course.Id);
                            if (userCourse != null)
                            {
                                userCourse.IsCompleted = true;
                                userCourse.CompletionDate = now;
                                userCourse.Progress = 100;
                            }
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();

            return new ExamResultDto
            {
                ExamId = examId,
                ExamTitle = exam.Title,
                UserId = userId,
                Score = scorePercentage,
                IsPassed = isPassed,
                PointsEarned = pointsEarned,
                StartTime = submitExamDto.StartTime,
                EndTime = now
            };
        }
        
        public async Task<IEnumerable<QuestionDto>> GetQuestionsByExamIdAsync(int examId)
        {
            return await _context.Questions
                .Where(q => q.ExamId == examId)
                .Include(q => q.Answers) // Include answers if you need them
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Text = q.Text,
                    Type = q.Type.ToString(),
                    Points = q.Points,
                    Answers = q.Answers.Select(a => new AnswerDto
                    {
                        Id = a.Id,
                        Text = a.Text,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                })
                .ToListAsync();
        }
        
        public async Task<Question> CreateQuestionAsync(CreateQuestionDto questionDto)
        {
            var question = new Question
            {
                Text = questionDto.Text,
                Points = questionDto.Points,
                ExamId = questionDto.ExamId,
                Type = questionDto.Type,
                Answers = questionDto.Answers.Select(a => new Answer
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect
                }).ToList()
            };

            _context.Questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<Question> UpdateQuestionAsync(int id, UpdateQuestionDto questionDto)
        {
            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (question == null) return null;
            
            question.Text = questionDto.Text ?? question.Text;
            question.Points = questionDto.Points ?? question.Points;
            question.Type = questionDto.Type ?? question.Type;
            question.UpdatedAt = DateTime.UtcNow;

            if (questionDto.Answers != null)
            {
                _context.Answers.RemoveRange(question.Answers);
                
                question.Answers = question.Answers.Select(a => new Answer
                {
                    Text = a.Text,
                    IsCorrect = a.IsCorrect,
                    QuestionId = question.Id 
                }).ToList();
            }

            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null) return false;

            _context.Questions.Remove(question);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<ExamResultDto>> GetUserExamResultsAsync(string userId)
        {
            var userExams = await _context.UserExams
                .Include(ue => ue.Exam)
                .Where(ue => ue.UserId == userId)
                .ToListAsync();

            return userExams.Select(ue => new ExamResultDto
            {
                ExamId = ue.ExamId,
                ExamTitle = ue.Exam.Title,
                UserId = ue.UserId,
                Score = ue.Score,
                IsPassed = ue.IsPassed,
                PointsEarned = ue.PointsEarned,
                StartTime = ue.StartTime,
                EndTime = ue.EndTime
            });
        }

        public async Task<IEnumerable<ExamResultDto>> GetExamResultsByCourseIdAsync(int courseId, string userId)
        {
            var exams = await _context.Exams
                .Where(e => e.CourseId == courseId)
                .Select(e => e.Id)
                .ToListAsync();

            var userExams = await _context.UserExams
                .Include(ue => ue.Exam)
                .Where(ue => ue.UserId == userId && exams.Contains(ue.ExamId))
                .ToListAsync();

            return userExams.Select(ue => new ExamResultDto
            {
                ExamId = ue.ExamId,
                ExamTitle = ue.Exam.Title,
                UserId = ue.UserId,
                Score = ue.Score,
                IsPassed = ue.IsPassed,
                PointsEarned = ue.PointsEarned,
                StartTime = ue.StartTime,
                EndTime = ue.EndTime
            });
        }
    }
}
