import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  goal: string; // What the agent needs to accomplish

  @IsObject()
  input: Record<string, any>; // Input parameters

  @IsOptional()
  @IsString()
  context?: string; // Additional context
}