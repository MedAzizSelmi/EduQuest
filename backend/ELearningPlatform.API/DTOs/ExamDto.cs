using System;
using System.Collections.Generic;

namespace ELearningPlatform.API.DTOs
{
    public class ExamDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public int TimeLimit { get; set; }
        public int PassingScore { get; set; }
        public int PointsToEarn { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsFinal { get; set; }
        public int QuestionsCount { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }

    public class CreateExamDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int CourseId { get; set; }
        public int TimeLimit { get; set; }
        public int PassingScore { get; set; }
        public int PointsToEarn { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsFinal { get; set; }
    }

    public class UpdateExamDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int? TimeLimit { get; set; }
        public int? PassingScore { get; set; }
        public int? PointsToEarn { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsFinal { get; set; }
    }

    public class SubmitExamDto
    {
        public DateTime StartTime { get; set; }
        public List<SubmitAnswerDto> Answers { get; set; }
    }

    public class ExamResultDto
    {
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public string UserId { get; set; }
        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public int PointsEarned { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Message { get; set; }
    }
}
