import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  // BullMQ Configuration
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '1'),

  // Queue settings
  defaultJobOptions: {
    attempts: parseInt(process.env.QUEUE_ATTEMPTS || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.QUEUE_BACKOFF_DELAY || '2000'),
    },
    removeOnComplete: true,
    removeOnFail: false,
  },

  // Worker configuration
  workers: parseInt(process.env.QUEUE_WORKERS || '4'),
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '2'),

  // Queue names
  queues: {
    agentJobs: 'agent-jobs',
    tasks: 'tasks',
    workflows: 'workflows',
  },
}));