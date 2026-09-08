/**
 * Agent-related interfaces for the multi-agent system
 */

import { ProductType, ComplexityLevel, APIError } from './common';

// Agent execution status
export type AgentStatusType = 'Waiting' | 'Working' | 'Completed' | 'Failed';

// Agent status interface for real-time monitoring
export interface AgentStatus {
  name: string;
  status: AgentStatusType;
  startTime?: Date;
  completionTime?: Date;
  error?: string;
}

// Agent configuration for system initialization
export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  outputFormat: 'markdown' | 'structured';
  requiredInputs: string[];
  maxTokens: number;
  temperature: number;
}

// Agent response structure
export interface AgentResponse {
  success: boolean;
  output: string;
  keyPoints: string[];
  error?: string;
  processingTime?: number;
}

// Context passed between agents in the sequential workflow
export interface AgentContext {
  softwareIdea: string;
  productType: ProductType;
  complexityLevel: ComplexityLevel;
  previousOutputs: Record<string, string>;
  sessionId: string;
}

// Analysis session tracking the complete multi-agent workflow
export interface AnalysisSession {
  id: string;
  request: {
    softwareIdea: string;
    productType: ProductType;
    complexityLevel: ComplexityLevel;
  };
  startTime: Date;
  endTime?: Date;
  currentAgent: number;
  agentOutputs: Record<string, AgentResponse>;
  status: 'running' | 'completed' | 'failed';
  error?: APIError;
}

// Agent sequence definition - must match the 6 agents in requirements
export const AGENT_SEQUENCE = [
  'Product Manager',
  'Requirements Analyst',
  'Software Architect', 
  'Database Designer',
  'Testing Engineer',
  'Deployment Planner'
] as const;

export type AgentName = typeof AGENT_SEQUENCE[number];

// Agent configurations mapping
export type AgentConfigs = Record<string, AgentConfig>;