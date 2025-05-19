using ELearningPlatform.API.Models;
using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.DTOs
{
    public class QuizDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public int TimeLimit { get; set; }
        public int PassingScore { get; set; }
        public int PointsToEarn { get; set; }
        public int QuestionsCount { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }

    public class CreateQuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public int TimeLimit { get; set; }
        public int PassingScore { get; set; }
        public int PointsToEarn { get; set; }
    }

    public class UpdateQuizDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? TimeLimit { get; set; }
        public int? PassingScore { get; set; }
        public int? PointsToEarn { get; set; }
    }

    public class QuestionDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int Points { get; set; }
        public string Type { get; set; }
        public List<AnswerDto> Answers { get; set; }
    }

    public class CreateQuestionDto
    {
        public string Text { get; set; }
        public int Points { get; set; }
        public QuestionType Type { get; set; }
        public int? QuizId { get; set; }
        public int? ExamId { get; set; }
        public List<CreateAnswerDto> Answers { get; set; }
    }

    public class UpdateQuestionDto
    {
        public string Text { get; set; }
        public int? Points { get; set; }
        public QuestionType? Type { get; set; }
        public List<CreateAnswerDto> Answers { get; set; }
    }

    public class AnswerDto
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class CreateAnswerDto
    {
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class UpdateAnswerDto
    {
        public string Text { get; set; }
        public bool? IsCorrect { get; set; }
    }

    public class SubmitQuizDto
    {
        public DateTime StartTime { get; set; }
        public List<SubmitAnswerDto> Answers { get; set; }
    }

    public class SubmitAnswerDto
    {
        public int QuestionId { get; set; }
        public List<int> AnswerIds { get; set; }
        public string TextAnswer { get; set; }
        public string CodeAnswer { get; set; }
    }

    public class QuizResultDto
    {
        public int QuizId { get; set; }
        public string QuizTitle { get; set; }
        public string UserId { get; set; }
        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public int PointsEarned { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int AttemptsCount { get; set; }
    }
}
