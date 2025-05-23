// Updated chat.component.ts
import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatResponse } from '../../models/chat.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false
})
export class ChatComponent {
  userQuestion: string = '';
  conversationId?: string;
  chatLog: {
    sender: 'user' | 'bot',
    text: string,
    timestamp: Date
  }[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  isMinimized: boolean = false;
  courseId?: number
  moduleId?: number
  lessonId?: number

  constructor(private chatService: ChatService,
              private route: ActivatedRoute) {
    // Get context from route parameters if available
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'] ? +params['courseId'] : undefined;
      this.moduleId = params['moduleId'] ? +params['moduleId'] : undefined;
      this.lessonId = params['lessonId'] ? +params['lessonId'] : undefined;
    });
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage(): void {
    const question = this.userQuestion.trim();
    if (!question) return;

    // Add user message to chat log immediately
    this.chatLog.push({
      sender: 'user',
      text: question,
      timestamp: new Date()
    });

    this.userQuestion = '';
    this.isLoading = true;
    this.errorMessage = '';

    this.chatService.sendChat(question,
      this.lessonId,
      this.moduleId,
      this.courseId,
      this.conversationId
    ).subscribe({
      next: (response: ChatResponse) => {
        const answer = response.answer || this.getDefaultAnswer(question);
        this.chatLog.push({
          sender: 'bot',
          text: answer,
          timestamp: new Date()
        });
        this.conversationId = response.conversation_id;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.chatLog.push({
          sender: 'bot',
          text: this.getDefaultAnswer(question),
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  private getDefaultAnswer(question: string): string {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('what is') && lowerQuestion.includes('platform')) {
      return `EduQuest is an interactive learning platform specializing in technology education. ` +
        `We offer courses in web development, programming, and software engineering.`;
    }

    if (lowerQuestion.includes('course') || lowerQuestion.includes('learn')) {
      return `We offer courses in: \n- Angular\n- React\n- JavaScript\n- Python\n- Web Development\n` +
        `Type 'courses' to see all available options.`;
    }

    return `I'm still learning about EduQuest. For more specific information, ` +
      `please try asking about:\n- Courses\n- Lessons\n- Your progress\n- Account features`;
  }
}
