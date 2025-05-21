import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ChatResponse} from '../models/chat.model';

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/chat`

  constructor(private http: HttpClient) {}

  sendChat(question: string, context: string, conversationId?: string){
    const payload = {
      context,
      question,
      conversation_id: conversationId || null,
      max_tokens: 2048,
      temperature: 0.7,
      system_prompt: null
    };

    return this.http.post<ChatResponse>(this.apiUrl, payload)
  }
}
