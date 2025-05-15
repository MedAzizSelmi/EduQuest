// question-create.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {CreateQuestionRequest, Question} from '../../../core/models/question.model';
import {QuizService} from '../../../core/services/quiz.service';

@Component({
  selector: 'app-question-create',
  templateUrl: './question-create.component.html',
  styleUrls: ['./question-create.component.scss'],
  standalone: false,
})
export class QuestionCreateComponent implements OnInit {
  loading = false;
  quizId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuizService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const param = params.get('quizId');
      if (param) {
        this.quizId = +param;
        console.log('Quiz ID loaded:', this.quizId);
      } else {
        console.error('Quiz ID is missing!');
        this.snackBar.open('Invalid quiz ID', 'Close', { duration: 3000 });
        this.router.navigate(['/quizzes']);
      }
    });
  }


  handleSubmit(questionData: Question): void {
    // Convert Question to CreateQuestionRequest
    const request: CreateQuestionRequest = {
      quizId: this.quizId,
      text: questionData.text,
      type: questionData.type,
      points: questionData.points,
      answers: questionData.answers
        ? questionData.answers.map(a => ({
          text: a.text,
          isCorrect: a.isCorrect
        }))
        : [] // Provide empty array if answers is undefined
    };

    this.questionService.createQuestion(request).subscribe({
      next: () => {
        this.snackBar.open('Question created successfully', 'Close', {
          duration: 3000,
        });
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
