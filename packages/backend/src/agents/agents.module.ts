import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { AgentsGateway } from './agents.gateway';
import { AgentExecutorService } from './agent-executor.service';
import { AgentMemoryService } from './agent-memory.service';
import { CodingAgent } from './agent-types/coding.agent';
import { PrismaModule } from '@/prisma/prisma.module';
import { AIModule } from '@/ai/ai.module';
import { RedisModule } from '@/redis/redis.module';
import { QueueModule } from '@/queue/queue.module';

@Module({
  imports: [PrismaModule, AIModule, RedisModule, QueueModule],
  providers: [
    AgentsService,
    AgentsGateway,
    AgentExecutorService,
    AgentMemoryService,
    CodingAgent,
  ],
  controllers: [AgentsController],
  exports: [AgentsService, AgentExecutorService],
})
export class AgentsModule {}