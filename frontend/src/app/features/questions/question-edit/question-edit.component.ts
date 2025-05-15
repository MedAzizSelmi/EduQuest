// question-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Question } from '../../../core/models/question.model';
import {QuizService} from '../../../core/services/quiz.service';

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss'],
  standalone: false
})
export class QuestionEditComponent implements OnInit {
  question!: Question;
  loading = false;
  quizId!: number;
  questionId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuizService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.parent?.parent?.paramMap.get('quizId')!;
    this.questionId = +this.route.snapshot.paramMap.get('questionId')!;
    this.loadQuestion();
  }

  loadQuestion(): void {
    this.loading = true;
    this.questionService.getQuestion(this.quizId, this.questionId).subscribe({
      next: (question) => {
        this.question = question;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading question', 'Close', {
          duration: 5000,
        });
        this.loading = false;
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    });
  }

  handleSubmit(updatedQuestion: Question): void {
    this.loading = true;
    this.questionService.updateQuestion(this.quizId, this.questionId, updatedQuestion).subscribe({
      next: () => {
        this.snackBar.open('Question updated successfully', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error: (error) => {
        this.snackBar.open(`Error updating question: ${error}`, 'Close', {
          duration: 5000,
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
