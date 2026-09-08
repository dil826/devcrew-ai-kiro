/**
 * Common types used throughout the DevCrew AI application
 */

// Product type options for software projects
export type ProductType = 
  | 'Web Application'
  | 'Mobile App' 
  | 'Desktop Application'
  | 'API Service'
  | 'E-commerce Platform';

// Complexity levels for project scope
export type ComplexityLevel = 'Prototype' | 'MVP';

// Theme options for user interface
export type Theme = 'light' | 'dark' | 'system';

// Generic API response wrapper
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// Validation error structure
export interface ValidationError {
  field: string;
  message: string;
  value: unknown;
}

// Generic error structure for consistent error handling
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}