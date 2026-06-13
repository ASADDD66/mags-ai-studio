import { registerAs } from '@nestjs/config';

export const AGENT_TYPES = {
  CODING: 'coding',
  RESEARCH: 'research',
  DATA_ANALYST: 'data_analyst',
  DEVOPS: 'devops',
  UI_UX: 'ui_ux',
  SECURITY: 'security',
  ASSISTANT: 'assistant',
} as const;

export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export default registerAs('agents', () => ({
  types: AGENT_TYPES,
  taskStatus: TASK_STATUS,

  // Agent configuration
  defaultModel: process.env.AGENT_DEFAULT_MODEL || 'gpt-4',
  defaultTemperature: parseFloat(process.env.AGENT_TEMPERATURE || '0.7'),
  defaultMaxTokens: parseInt(process.env.AGENT_MAX_TOKENS || '4000'),

  // Execution limits
  maxConcurrentAgents: parseInt(process.env.MAX_CONCURRENT_AGENTS || '5'),
  maxTaskDurationMs: parseInt(process.env.MAX_TASK_DURATION || '600000'), // 10 minutes
  maxSubtasks: parseInt(process.env.MAX_SUBTASKS || '10'),

  // Memory configuration
  shortTermMemorySize: parseInt(process.env.SHORT_TERM_MEMORY_SIZE || '20'),
  longTermMemorySize: parseInt(process.env.LONG_TERM_MEMORY_SIZE || '1000'),

  // Retry configuration
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  retryDelayMs: parseInt(process.env.RETRY_DELAY || '1000'),

  // Tool configuration
  enabledTools: (process.env.ENABLED_TOOLS || 'web_search,code_execution').split(','),
  sandboxMode: process.env.SANDBOX_MODE === 'true',

  // Rate limiting
  maxTasksPerMinute: parseInt(process.env.MAX_TASKS_PER_MINUTE || '60'),
  maxTokensPerDay: parseInt(process.env.MAX_TOKENS_PER_DAY || '1000000'),
}));