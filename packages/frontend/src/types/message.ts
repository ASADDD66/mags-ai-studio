export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  tokens?: number;
  modelUsed?: string;
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface StreamingMessage extends Omit<ChatMessage, 'id'> {
  tempId: string;
  isStreaming: boolean;
}

export interface MessageCreatePayload {
  content: string;
}
