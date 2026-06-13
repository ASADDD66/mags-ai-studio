import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { AIService } from '@/ai/ai.service';
import { RedisService } from '@/redis/redis.service';
import { AgentQueueService } from '@/queue/agent-queue.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { CodingAgent } from './agent-types/coding.agent';
import { BaseAgent } from './agent-types/base-agent';
import { IAgent } from './interfaces/agent.interface';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private agents = new Map<string, BaseAgent>();

  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
    private redisService: RedisService,
    private queueService: AgentQueueService,
    private configService: ConfigService,
    private codingAgent: CodingAgent,
  ) {
    this.initializeAgents();
  }

  /**
   * Initialize built-in agents
   */
  private initializeAgents(): void {
    this.agents.set('coding', this.codingAgent);
    // Register other agents...
  }

  /**
   * Create new agent
   */
  async createAgent(userId: string, createAgentDto: CreateAgentDto): Promise<IAgent> {
    const { name, type, description, modelId, systemPrompt, tools } = createAgentDto;

    // Validate agent type
    const validTypes = Object.values(this.configService.get('agents.types'));
    if (!validTypes.includes(type)) {
      throw new BadRequestException(`Invalid agent type: ${type}`);
    }

    // Create agent
    const agent = await this.prisma.agent.create({
      data: {
        userId,
        name,
        type,
        description,
        modelId: modelId || 'gpt-4',
        systemPrompt: systemPrompt || this.getDefaultSystemPrompt(type),
        tools: tools || [],
        temperature: 0.7,
        maxTokens: 4000,
        topP: 1.0,
      },
    });

    // Cache agent
    await this.redisService.setJSON(`agent:${agent.id}`, agent, 3600);

    this.logger.log(`Created agent: ${agent.id} (${type})`);

    return agent as IAgent;
  }

  /**
   * Get agent by ID
   */
  async getAgentById(agentId: string, userId: string): Promise<IAgent> {
    // Check cache first
    const cached = await this.redisService.getJSON(`agent:${agentId}`);
    if (cached) {
      return cached;
    }

    const agent = await this.prisma.agent.findUnique({
      where: { id: agentId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        memories: {
          where: { type: 'long_term' },
          orderBy: { relevance: 'desc' },
          take: 10,
        },
      },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.userId !== userId) {
      throw new BadRequestException('Unauthorized access to agent');
    }

    // Cache result
    await this.redisService.setJSON(`agent:${agentId}`, agent, 3600);

    return agent as IAgent;
  }

  /**
   * Get all agents for user
   */
  async getUserAgents(userId: string): Promise<IAgent[]> {
    const agents = await this.prisma.agent.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return agents as IAgent[];
  }

  /**
   * Create task and queue for execution
   */
  async createTask(
    userId: string,
    agentId: string,
    title: string,
    goal: string,
    input: Record<string, any>,
    context?: string,
  ): Promise<string> {
    // Get agent
    const agent = await this.getAgentById(agentId, userId);

    // Create task
    const task = await this.prisma.agentTask.create({
      data: {
        userId,
        agentId,
        title,
        description: goal,
        goal,
        input,
        context,
        status: 'pending',
        priority: 'medium',
      },
    });

    // Queue the task
    await this.queueService.addTask({
      taskId: task.id,
      agentId,
      userId,
      goal,
      input,
      context,
      maxTokens: agent.maxTokens,
    });

    this.logger.log(`Created task: ${task.id} for agent: ${agentId}`);

    return task.id;
  }

  /**
   * Get task details
   */
  async getTask(taskId: string, userId: string): Promise<any> {
    const task = await this.prisma.agentTask.findUnique({
      where: { id: taskId },
      include: {
        agent: true,
        parentTask: true,
        childTasks: true,
        logs: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new BadRequestException('Unauthorized access to task');
    }

    return task;
  }

  /**
   * Delete agent
   */
  async deleteAgent(agentId: string, userId: string): Promise<void> {
    const agent = await this.getAgentById(agentId, userId);

    await this.prisma.agent.update({
      where: { id: agentId },
      data: { isActive: false },
    });

    await this.redisService.delete(`agent:${agentId}`);

    this.logger.log(`Deleted agent: ${agentId}`);
  }

  /**
   * Get default system prompt for agent type
   */
  private getDefaultSystemPrompt(type: string): string {
    const prompts: Record<string, string> = {
      coding: `You are an expert coding assistant. Help with code writing, debugging, refactoring, and analysis. Always follow best practices and consider security implications.`,
      research: `You are a research expert. Search for information, analyze data, and provide well-sourced insights.`,
      data_analyst: `You are a data analyst. Analyze data, create visualizations, write SQL queries, and provide business insights.`,
      devops: `You are a DevOps engineer. Help with infrastructure, deployments, monitoring, and system administration.`,
      ui_ux: `You are a UI/UX designer. Help with design thinking, user experience, and interface improvements.`,
      security: `You are a security expert. Identify vulnerabilities, suggest security improvements, and ensure best practices.`,
      assistant: `You are a helpful AI assistant. Assist users with various tasks and provide thoughtful, well-reasoned responses.`,
    };

    return prompts[type] || prompts.assistant;
  }
}