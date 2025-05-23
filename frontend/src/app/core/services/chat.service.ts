import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ChatResponse} from '../models/chat.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/chat`

  constructor(private http: HttpClient) {}

  sendChat(question: string, lessonId?: number, moduleId?: number, courseId?: number, conversationId?: string):Observable<ChatResponse> {
    const payload = {
      context : '',
      question,
      conversation_id: conversationId || null,
      max_tokens: 2048,
      temperature: 0.7,
      system_prompt: null,
      lessonId: lessonId || null,
      moduleId: moduleId || null,
      courseId: courseId || null
    };

    return this.http.post<ChatResponse>(this.apiUrl, payload)
  }
}
