export interface IAgentMemory {
  id: string;
  userId: string;
  agentId: string;
  type: 'short_term' | 'long_term' | 'session';
  content: string;
  embedding?: number[];
  relevance: number;
  accessCount: number;
  lastAccessedAt?: Date;
  expiresAt?: Date;
  linkedTaskId?: string;
  linkedChatId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryEntry {
  id: string;
  content: string;
  relevance: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}