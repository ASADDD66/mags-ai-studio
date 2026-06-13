export interface IAgent {
  id: string;
  userId: string;
  name: string;
  type: string;
  description?: string;
  modelId: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
  permissions: string[];
  isActive: boolean;
  taskCount: number;
  totalTokens: number;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  modelId: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  tools: string[];
}

export interface AgentContext {
  agentId: string;
  userId: string;
  taskId: string;
  config: AgentConfig;
  memory: AgentMemoryContext;
  tools: string[];
}

export interface AgentMemoryContext {
  shortTerm: string[]; // Recent interactions
  longTerm: string[]; // Important facts
  session: string[]; // Current conversation
}

export interface AgentThought {
  type: 'reasoning' | 'planning' | 'decision' | 'reflection';
  content: string;
  timestamp: number;
}

export interface AgentAction {
  type: 'tool_call' | 'subtask' | 'agent_call' | 'response';
  name: string;
  input: Record<string, any>;
  reasoning: string;
}

export interface AgentObservation {
  toolName: string;
  result: any;
  timestamp: number;
}