// question-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Answer, Question, QuestionType} from '../../../core/models/question.model';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  standalone: false
})
export class QuestionFormComponent implements OnInit {
  @Input() question!: Question;
  @Output() submitForm = new EventEmitter<Question>();
  @Output() onCancel = new EventEmitter<void>();

  questionForm!: FormGroup;
  questionTypes = Object.values(QuestionType).filter(value => typeof value === 'string');
  selectedType: QuestionType = QuestionType.MultipleChoice;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this.question) {
      this.patchForm();
    }
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      type: [QuestionType.MultipleChoice, Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
      answers: this.fb.array([])
    });

    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.selectedType = type;
      this.updateAnswerControls();
    });

    this.addAnswer(); // Start with one answer by default
  }

  patchForm(): void {
    this.questionForm.patchValue({
      text: this.question.text,
      type: this.question.type,
      points: this.question.points
    });

    this.answers.clear();
    if (this.question.answers && this.question.answers.length > 0) {
      this.question.answers.forEach(answer => {
        this.addAnswer(answer);
      });
    }
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(answer?: Answer): void {
    const answerGroup = this.fb.group({
      text: [answer?.text || '', Validators.required],
      isCorrect: [answer?.isCorrect || false]
    });
    this.answers.push(answerGroup);
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  updateAnswerControls(): void {
    // For True/False questions, we only want two options
    if (this.selectedType === QuestionType.TrueFalse) {
      while (this.answers.length > 0) {
        this.answers.removeAt(0);
      }

      // Add true and false options
      this.addAnswer({ text: 'True', isCorrect: false } as Answer);
      this.addAnswer({ text: 'False', isCorrect: false } as Answer);
    } else if (this.answers.length === 0) {
      // For other types, ensure at least one answer exists
      this.addAnswer();
    }
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const question: Question = {
        ...this.questionForm.value,
        quizId: this.question?.quizId || 0,
        id: this.question?.id || 0
      };
      this.submitForm.emit(question);
    }
  }


  protected readonly QuestionType = QuestionType;
}
