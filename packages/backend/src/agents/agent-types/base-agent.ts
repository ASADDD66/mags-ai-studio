import { Logger } from '@nestjs/common';
import { AIService } from '@/ai/ai.service';
import { AgentContext, AgentThought, AgentAction, AgentObservation } from '../interfaces/agent.interface';
import { TaskExecutionContext, IAgentTask } from '../interfaces/task.interface';

export abstract class BaseAgent {
  protected logger: Logger;
  protected thoughts: AgentThought[] = [];
  protected actions: AgentAction[] = [];
  protected observations: AgentObservation[] = [];

  constructor(
    protected agentId: string,
    protected agentName: string,
    protected aiService: AIService,
  ) {
    this.logger = new Logger(`${agentName}Agent`);
  }

  /**
   * Main execution method
   */
  async execute(context: TaskExecutionContext): Promise<any> {
    this.logger.log(`Executing task: ${context.taskId} - ${context.goal}`);

    try {
      // Step 1: Analyze the task
      const analysis = await this.analyzeTask(context);
      this.addThought('reasoning', `Analyzed task: ${JSON.stringify(analysis)}`);

      // Step 2: Create plan
      const plan = await this.createPlan(context, analysis);
      this.addThought('planning', `Created plan with ${plan.steps.length} steps`);

      // Step 3: Execute plan
      const result = await this.executePlan(context, plan);

      // Step 4: Reflect and learn
      await this.reflect(context, result);

      return result;
    } catch (error) {
      this.logger.error(`Task execution failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze the task
   */
  protected async analyzeTask(context: TaskExecutionContext): Promise<any> {
    const prompt = `
      Analyze this task:
      Goal: ${context.goal}
      Input: ${JSON.stringify(context.input)}
      Context: ${context.context}
      
      Provide your analysis in JSON format with: key_points, challenges, requirements
    `;

    const response = await this.aiService.complete({
      messages: [{ role: 'user', content: prompt }],
      modelId: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return { analysis: response.content };
    }
  }

  /**
   * Create execution plan
   */
  protected async createPlan(context: TaskExecutionContext, analysis: any): Promise<any> {
    const prompt = `
      Based on this analysis:
      ${JSON.stringify(analysis)}
      
      Create a step-by-step plan to achieve: ${context.goal}
      
      Return JSON with: steps (array of steps), tools_needed, estimated_tokens
    `;

    const response = await this.aiService.complete({
      messages: [{ role: 'user', content: prompt }],
      modelId: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1500,
    });

    try {
      return JSON.parse(response.content);
    } catch {
      return { steps: [{ description: response.content }] };
    }
  }

  /**
   * Execute the plan
   */
  protected async executePlan(context: TaskExecutionContext, plan: any): Promise<any> {
    const results: any[] = [];

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      this.logger.log(`Executing step ${i + 1}: ${step.description}`);

      try {
        const stepResult = await this.executeStep(context, step);
        results.push(stepResult);

        this.addObservation(`step_${i + 1}`, stepResult);
      } catch (error) {
        this.logger.error(`Step ${i + 1} failed: ${error.message}`);
        throw error;
      }
    }

    return {
      success: true,
      steps: results,
      summary: this.generateSummary(results),
    };
  }

  /**
   * Execute individual step
   */
  protected async executeStep(context: TaskExecutionContext, step: any): Promise<any> {
    // Override in subclasses
    const prompt = `Execute this step: ${step.description}`;
    const response = await this.aiService.complete({
      messages: [{ role: 'user', content: prompt }],
      modelId: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    });

    return { step: step.description, result: response.content };
  }

  /**
   * Reflect on results
   */
  protected async reflect(context: TaskExecutionContext, result: any): Promise<void> {
    const prompt = `
      Task completed with result:
      ${JSON.stringify(result)}
      
      What did we learn? What went well? What could improve?
    `;

    const response = await this.aiService.complete({
      messages: [{ role: 'user', content: prompt }],
      modelId: 'gpt-4',
      temperature: 0.5,
      maxTokens: 500,
    });

    this.addThought('reflection', response.content);
  }

  /**
   * Helper methods
   */
  protected addThought(type: string, content: string): void {
    this.thoughts.push({
      type: type as any,
      content,
      timestamp: Date.now(),
    });
  }

  protected addAction(type: string, name: string, input: any, reasoning: string): void {
    this.actions.push({
      type: type as any,
      name,
      input,
      reasoning,
    });
  }

  protected addObservation(toolName: string, result: any): void {
    this.observations.push({
      toolName,
      result,
      timestamp: Date.now(),
    });
  }

  protected generateSummary(results: any[]): string {
    return `Completed ${results.length} steps successfully`;
  }

  /**
   * Get execution trace
   */
  public getExecutionTrace(): any {
    return {
      agentId: this.agentId,
      agentName: this.agentName,
      thoughts: this.thoughts,
      actions: this.actions,
      observations: this.observations,
      timestamp: Date.now(),
    };
  }
}