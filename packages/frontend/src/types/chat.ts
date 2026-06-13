export interface Chat {
  id: string;
  title: string;
  description?: string;
  modelId: string;
  messageCount: number;
  tokenUsage: number;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: Date;
  lastMessageAt?: Date;
  archivedAt?: Date;
}

export interface ChatDetail extends Chat {
  systemPrompt?: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  messages?: ChatMessage[];
}

export interface CreateChatPayload {
  title?: string;
  modelId?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}
