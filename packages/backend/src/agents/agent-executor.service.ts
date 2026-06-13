import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { AgentMemoryService } from './agent-memory.service';
import { CodingAgent } from './agent-types/coding.agent';
import { BaseAgent } from './agent-types/base-agent';
import { TaskExecutionContext, IAgentTask } from './interfaces/task.interface';

@Injectable()
export class AgentExecutorService {
  private readonly logger = new Logger(AgentExecutorService.name);
  private agents = new Map<string, BaseAgent>();
  private executingTasks = new Map<string, boolean>();

  constructor(
    private prisma: PrismaService,
    private memoryService: AgentMemoryService,
    private configService: ConfigService,
    private codingAgent: CodingAgent,
  ) {
    this.initializeAgents();
  }

  /**
   * Initialize agents
   */
  private initializeAgents(): void {
    this.agents.set('coding', this.codingAgent);
    // Register other agents...
  }

  /**
   * Execute task with agent
   */
  async executeTask(task: IAgentTask): Promise<any> {
    if (this.executingTasks.has(task.id)) {
      throw new Error(`Task ${task.id} is already executing`);
    }

    this.executingTasks.set(task.id, true);

    try {
      // Mark task as running
      await this.prisma.agentTask.update({
        where: { id: task.id },
        data: { status: 'running', startedAt: new Date() },
      });

      // Get agent
      const agent = this.agents.get(task.agentId || 'assistant');
      if (!agent) {
        throw new Error(`Agent not found: ${task.agentId}`);
      }

      // Get memory context
      const memoryContext = await this.memoryService.getMemoryContext(
        task.agentId || '',
        task.userId,
      );

      // Build execution context
      const executionContext: TaskExecutionContext = {
        taskId: task.id,
        agentId: task.agentId || '',
        userId: task.userId,
        goal: task.goal,
        input: task.input || {},
        context: task.context || '',
        maxTokens: 4000,
      };

      // Execute
      this.logger.log(`Executing task: ${task.id}`);
      const result = await agent.execute(executionContext);

      // Save result
      await this.prisma.agentTask.update({
        where: { id: task.id },
        data: {
          status: 'completed',
          completedAt: new Date(),
          result,
          durationMs: Date.now() - task.createdAt.getTime(),
        },
      });

      // Store in long-term memory
      await this.memoryService.addMemory(
        task.userId,
        task.agentId || '',
        'long_term',
        `Completed task: ${task.title} - Result: ${JSON.stringify(result)}`,
        task.id,
      );

      this.logger.log(`Task completed: ${task.id}`);

      return result;
    } catch (error) {
      this.logger.error(`Task failed: ${task.id} - ${error.message}`);

      await this.prisma.agentTask.update({
        where: { id: task.id },
        data: {
          status: 'failed',
          completedAt: new Date(),
          error: error.message,
          durationMs: Date.now() - task.createdAt.getTime(),
        },
      });

      throw error;
    } finally {
      this.executingTasks.delete(task.id);
    }
  }
}