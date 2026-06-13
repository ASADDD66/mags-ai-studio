import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name: string;

  @IsString()
  type: string; // coding, research, data_analyst, etc.

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  modelId?: string;

  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @IsOptional()
  @IsArray()
  tools?: string[];
}