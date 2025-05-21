export interface ChatResponse {
  answer: string;
  conversation_id: string;
  tokens_used: number;
  processing_time: number;
}
