// Updated chat.component.ts
import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatResponse } from '../../models/chat.model';

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

  constructor(private chatService: ChatService) {}

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

    // Example context – replace with actual lesson/module/course data
    const context = `
      EduQuest is an online learning platform offering interactive courses, quizzes,
      and coding exercises. Our platform focuses on technology education including
      Angular, React, JavaScript, and other web development technologies.
    `;

    this.userQuestion = '';
    this.isLoading = true;
    this.errorMessage = '';

    this.chatService.sendChat(question, context, this.conversationId).subscribe({
      next: (response: ChatResponse) => {
        this.chatLog.push({
          sender: 'bot',
          text: response.answer,
          timestamp: new Date()
        });
        this.conversationId = response.conversation_id;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Chat error:', err);
        this.errorMessage = 'Something went wrong. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
