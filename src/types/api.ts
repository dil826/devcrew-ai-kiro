/**
 * API request/response types for client-server communication
 */

import { ProductType, ComplexityLevel, APIError } from './common';
import { AgentStatus } from './agent';
import { Blueprint } from './blueprint';

// Analysis request from client to server
export interface AnalysisRequest {
  softwareIdea: string;
  productType: ProductType;
  complexityLevel: ComplexityLevel;
}

// Analysis response from server to client
export interface AnalysisResponse {
  success: boolean;
  sessionId: string;
  blueprint?: Blueprint;
  error?: string;
  agentStatuses: AgentStatus[];
  processingTime?: number;
}

// Real-time status update for WebSocket or polling
export interface StatusUpdate {
  sessionId: string;
  currentAgent: number;
  agentStatuses: AgentStatus[];
  completedSections: number;
  estimatedTimeRemaining?: number;
}

// Gemini API request structure
export interface GeminiAPIRequest {
  prompt: string;
  systemMessage?: string;
  maxTokens: number;
  temperature: number;
  context?: string;
}

// Gemini API response structure  
export interface GeminiAPIResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'function_call';
}

// Server-side error responses
export interface ServerErrorResponse {
  error: APIError;
  requestId: string;
  timestamp: string;
}

// Health check response for API monitoring
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  services: {
    gemini: 'available' | 'unavailable';
    storage: 'available' | 'unavailable';
  };
  version: string;
}

// Rate limiting information
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}