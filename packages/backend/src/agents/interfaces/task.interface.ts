export interface IAgentTask {
  id: string;
  userId: string;
  agentId?: string;
  title: string;
  description?: string;
  goal: string;
  input?: Record<string, any>;
  context?: string;
  status: string; // pending, running, completed, failed
  priority: string; // low, medium, high
  startedAt?: Date;
  completedAt?: Date;
  durationMs?: number;
  result?: Record<string, any>;
  error?: string;
  subtasks: string[];
  parentTaskId?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecutionContext {
  taskId: string;
  agentId: string;
  userId: string;
  goal: string;
  input: Record<string, any>;
  context: string;
  maxTokens: number;
}