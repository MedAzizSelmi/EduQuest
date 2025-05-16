// question-create.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CreateQuestionRequest, Question} from '../../../core/models/question.model';
import {QuizService} from '../../../core/services/quiz.service';
import {ExamService} from '../../../core/services/exam.service';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss'],
  standalone: false,
})
export class QuestionCreateComponent implements OnInit {
  loading = false;
  quizId!: number;
  examId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuizService,
    private examService: ExamService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const parentRoute = this.route.parent;
    if (!parentRoute) {
      this.snackBar.open('Invalid route structure', 'Close', { duration: 3000 });
      this.router.navigate(['/']);
      return;
    }

    parentRoute.paramMap.subscribe(params => {
      if (params.has('quizId')) {
        this.quizId = +params.get('quizId')!;
        console.log('Creating question for Quiz ID:', this.quizId);
      } else if (params.has('examId')) {
        this.examId = +params.get('examId')!;
        console.log('Creating question for Exam ID:', this.examId);
      } else {
        this.snackBar.open('Missing quiz or exam ID', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });
  }


  handleSubmit(questionData: Question): void {
    const request: CreateQuestionRequest = {
      quizId: this.quizId,
      examId: this.examId,
      text: questionData.text,
      type: questionData.type,
      points: questionData.points,
      answers: questionData.answers?.map(a => ({
        text: a.text,
        isCorrect: a.isCorrect
      })) || []
    };

    this.loading = true;

    const create$ = this.quizId
      ? this.questionService.createQuestion(request)
      : this.examId
        ? this.examService.createQuestion(request)
        : null;

    if (!create$) {
      this.snackBar.open('No valid context (quiz or exam) found', 'Close', { duration: 3000 });
      return;
    }

    create$.subscribe({
      next: () => {
        this.snackBar.open('Question created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (error) => {
        this.snackBar.open(`Error creating question: ${error}`, 'Close', {
          duration: 5000,
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
