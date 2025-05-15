// question-management.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizService } from '../../../core/services/quiz.service';
import { Question } from '../../../core/models/question.model';
import { MatDialog } from '@angular/material/dialog';
import {QuestionType} from '../../../core/models/question.model';
import {ConfirmDialogComponent} from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-question-management',
  templateUrl: './question-management.component.html',
  styleUrls: ['./question-management.component.scss'],
  standalone: false
})
export class QuestionManagementComponent implements OnInit {
  questions: Question[] = [];
  quizId!: number;
  loading = false;
  displayedColumns: string[] = ['text', 'type', 'points', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuizService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('quizId')!;
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.questionService.getQuestionsByQuiz(this.quizId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading questions', 'Close', {
          duration: 5000,
        });
        this.loading = false;
      }
    });
  }

  addQuestion(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  editQuestion(question: Question): void {
    this.router.navigate(['edit', question.id], { relativeTo: this.route });
  }

  deleteQuestion(question: Question): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Question',
        message: `Are you sure you want to delete this question?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.questionService.deleteQuestion(this.quizId, question.id).subscribe({
          next: () => {
            this.snackBar.open('Question deleted successfully', 'Close', {
              duration: 3000,
            });
            this.loadQuestions();
          },
          error: (error) => {
            this.snackBar.open(`Error deleting question: ${error}`, 'Close', {
              duration: 5000,
            });
          }
        });
      }
    });
  }

  getQuestionTypeName(type: QuestionType): string {
    return QuestionType[type as unknown as keyof typeof QuestionType];
  }

  goBackToQuiz(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
