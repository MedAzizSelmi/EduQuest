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
    public class QuizService : IQuizService
    {
        private readonly ApplicationDbContext _context;

        public QuizService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<QuizDto>> GetQuizzesByCourseIdAsync(int courseId)
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Questions)
                .Where(q => q.CourseId == courseId)
                .ToListAsync();

            return quizzes.Select(q => new QuizDto
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                CourseId = q.CourseId,
                TimeLimit = q.TimeLimit,
                PassingScore = q.PassingScore,
                PointsToEarn = q.PointsToEarn,
                QuestionsCount = q.Questions.Count
            });
        }

        public async Task<QuizDto> GetQuizByIdAsync(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null) return null;

            return new QuizDto
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                CourseId = quiz.CourseId,
                TimeLimit = quiz.TimeLimit,
                PassingScore = quiz.PassingScore,
                PointsToEarn = quiz.PointsToEarn,
                QuestionsCount = quiz.Questions.Count,
                Questions = quiz.Questions.Select(q => new QuestionDto
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

        public async Task<Quiz> CreateQuizAsync(CreateQuizDto quizDto)
        {
            var quiz = new Quiz
            {
                Title = quizDto.Title,
                Description = quizDto.Description,
                CourseId = quizDto.CourseId,
                TimeLimit = quizDto.TimeLimit,
                PassingScore = quizDto.PassingScore,
                PointsToEarn = quizDto.PointsToEarn
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task<Quiz> UpdateQuizAsync(int id, UpdateQuizDto quizDto)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return null;

            quiz.Title = quizDto.Title ?? quiz.Title;
            quiz.Description = quizDto.Description ?? quiz.Description;
            quiz.TimeLimit = quizDto.TimeLimit ?? quiz.TimeLimit;
            quiz.PassingScore = quizDto.PassingScore ?? quiz.PassingScore;
            quiz.PointsToEarn = quizDto.PointsToEarn ?? quiz.PointsToEarn;
            quiz.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return quiz;
        }

        public async Task<bool> DeleteQuizAsync(int id)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return false;

            _context.Quizzes.Remove(quiz);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<QuizResultDto> SubmitQuizAsync(int quizId, string userId, SubmitQuizDto submitQuizDto)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null) return null;

            // Calculate score
            int totalPoints = quiz.Questions.Sum(q => q.Points);
            int earnedPoints = 0;

            foreach (var answer in submitQuizDto.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
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
            bool isPassed = scorePercentage >= quiz.PassingScore;
            int pointsEarned = isPassed ? quiz.PointsToEarn : 0;

            // Check if user has already taken this quiz
            var userQuiz = await _context.UserQuizzes
                .FirstOrDefaultAsync(uq => uq.UserId == userId && uq.QuizId == quizId);

            if (userQuiz == null)
            {
                userQuiz = new UserQuiz
                {
                    UserId = userId,
                    QuizId = quizId,
                    StartTime = submitQuizDto.StartTime,
                    EndTime = DateTime.UtcNow,
                    Score = scorePercentage,
                    IsPassed = isPassed,
                    PointsEarned = pointsEarned,
                    AttemptsCount = 1
                };
                _context.UserQuizzes.Add(userQuiz);
            }
            else
            {
                userQuiz.EndTime = DateTime.UtcNow;
                userQuiz.Score = Math.Max(userQuiz.Score, scorePercentage);
                userQuiz.IsPassed = userQuiz.IsPassed || isPassed;
                userQuiz.PointsEarned = Math.Max(userQuiz.PointsEarned, pointsEarned);
                userQuiz.AttemptsCount++;
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
                }
            }

            await _context.SaveChangesAsync();

            return new QuizResultDto
            {
                QuizId = quizId,
                QuizTitle = quiz.Title,
                UserId = userId,
                Score = scorePercentage,
                IsPassed = isPassed,
                PointsEarned = pointsEarned,
                StartTime = submitQuizDto.StartTime,
                EndTime = DateTime.UtcNow,
                AttemptsCount = userQuiz.AttemptsCount
            };
        }

        public async Task<IEnumerable<QuizResultDto>> GetUserQuizResultsAsync(string userId)
        {
            var userQuizzes = await _context.UserQuizzes
                .Include(uq => uq.Quiz)
                .Where(uq => uq.UserId == userId)
                .ToListAsync();

            return userQuizzes.Select(uq => new QuizResultDto
            {
                QuizId = uq.QuizId,
                QuizTitle = uq.Quiz.Title,
                UserId = uq.UserId,
                Score = uq.Score,
                IsPassed = uq.IsPassed,
                PointsEarned = uq.PointsEarned,
                StartTime = uq.StartTime,
                EndTime = uq.EndTime,
                AttemptsCount = uq.AttemptsCount
            });
        }

        public async Task<IEnumerable<QuizResultDto>> GetQuizResultsByCourseIdAsync(int courseId, string userId)
        {
            var quizzes = await _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .Select(q => q.Id)
                .ToListAsync();

            var userQuizzes = await _context.UserQuizzes
                .Include(uq => uq.Quiz)
                .Where(uq => uq.UserId == userId && quizzes.Contains(uq.QuizId))
                .ToListAsync();

            return userQuizzes.Select(uq => new QuizResultDto
            {
                QuizId = uq.QuizId,
                QuizTitle = uq.Quiz.Title,
                UserId = uq.UserId,
                Score = uq.Score,
                IsPassed = uq.IsPassed,
                PointsEarned = uq.PointsEarned,
                StartTime = uq.StartTime,
                EndTime = uq.EndTime,
                AttemptsCount = uq.AttemptsCount
            });
        }
    }
}
