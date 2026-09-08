/**
 * Application constants and configuration values
 */

import { AgentConfig, ProductType } from './index';

// Maximum character limit for software ideas (Requirement 1.2)
export const MAX_SOFTWARE_IDEA_LENGTH = 3000;

// Maximum number of projects to store locally (Requirement 9.5)
export const MAX_STORED_PROJECTS = 10;

// API timeout configurations
export const API_TIMEOUTS = {
  AGENT_PROCESSING: 60000, // 60 seconds per agent
  TOTAL_ANALYSIS: 600000,  // 10 minutes total
  HEALTH_CHECK: 5000       // 5 seconds
} as const;

// Product type options (Requirement 2.1)
export const PRODUCT_TYPES: ProductType[] = [
  'Web Application',
  'Mobile App',
  'Desktop Application',
  'API Service',
  'E-commerce Platform'
];

// Example software ideas for user guidance (Requirement 1.4)
export const EXAMPLE_SOFTWARE_IDEAS = [
  "A task management app for small teams with real-time collaboration, file attachments, and deadline tracking",
  "An e-commerce platform for handmade crafts with integrated payment processing and seller profiles",
  "A mobile fitness app that creates personalized workout plans based on user goals and available equipment",
  "A restaurant ordering system with menu management, order tracking, and customer feedback features",
  "A personal finance tracker that categorizes expenses, sets budgets, and provides spending insights"
] as const;

// Agent configuration templates (Requirements 4.1, 6.2-6.9)
export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  productManager: {
    name: 'Product Manager',
    role: 'Define product vision and user stories',
    systemPrompt: `You are an expert product manager analyzing software ideas. Create a comprehensive product analysis including:
    - Project summary and vision
    - Target user identification and personas
    - Core features and functionality
    - User stories with acceptance criteria
    - Success metrics and KPIs
    Format your response with clear sections and actionable insights.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel'],
    maxTokens: 2000,
    temperature: 0.7
  },
  
  requirementsAnalyst: {
    name: 'Requirements Analyst',
    role: 'Generate functional and non-functional requirements',
    systemPrompt: `You are a senior requirements analyst. Based on the product manager's analysis and user input, create:
    - Detailed functional requirements with priorities
    - Non-functional requirements (performance, security, usability)
    - System constraints and assumptions
    - Acceptance criteria for each requirement
    - Risk assessment and mitigation strategies
    Ensure requirements are testable, measurable, and complete.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel', 'productManagerOutput'],
    maxTokens: 2500,
    temperature: 0.6
  },
  
  softwareArchitect: {
    name: 'Software Architect',
    role: 'Design system architecture and technology stack',
    systemPrompt: `You are a senior software architect. Design the technical foundation including:
    - Recommended technology stack with justification
    - High-level system architecture diagram description
    - Component breakdown and interactions
    - Data flow and integration patterns
    - Scalability and performance considerations
    - Security architecture recommendations
    Base decisions on the requirements and product complexity level.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel', 'requirementsOutput'],
    maxTokens: 2500,
    temperature: 0.5
  },
  
  databaseDesigner: {
    name: 'Database Designer',
    role: 'Create database schema and data models',
    systemPrompt: `You are a database design expert. Create comprehensive data architecture including:
    - Entity-relationship model
    - Database schema with tables, fields, and relationships
    - Data types and constraints
    - Indexing strategy for performance
    - Data migration and backup considerations
    - CRUD operation patterns
    Align with the technical architecture and functional requirements.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel', 'architectureOutput'],
    maxTokens: 2000,
    temperature: 0.4
  },
  
  testingEngineer: {
    name: 'Testing Engineer',
    role: 'Develop testing strategy and test plans',
    systemPrompt: `You are a QA and testing expert. Create a comprehensive testing strategy including:
    - Testing approach and methodology
    - Unit, integration, and end-to-end test plans
    - Test case examples for critical features
    - Performance and security testing strategies
    - Test automation recommendations
    - Quality assurance processes
    Base testing plans on requirements and technical architecture.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel', 'requirementsOutput', 'architectureOutput'],
    maxTokens: 2000,
    temperature: 0.5
  },
  
  deploymentPlanner: {
    name: 'Deployment Planner',
    role: 'Plan deployment and infrastructure',
    systemPrompt: `You are a DevOps and deployment expert. Create deployment strategy including:
    - Infrastructure requirements and recommendations
    - Deployment pipeline and CI/CD strategy
    - Environment setup (development, staging, production)
    - Monitoring and logging strategy
    - Backup and disaster recovery plans
    - Scaling and maintenance considerations
    Align with technical architecture and operational requirements.`,
    outputFormat: 'structured',
    requiredInputs: ['softwareIdea', 'productType', 'complexityLevel', 'architectureOutput', 'databaseOutput'],
    maxTokens: 2000,
    temperature: 0.5
  }
};

// Storage keys for local storage
export const STORAGE_KEYS = {
  PROJECTS: 'devcrew-projects',
  SETTINGS: 'devcrew-settings',
  CACHE: 'devcrew-cache',
  METADATA: 'devcrew-metadata'
} as const;

// Default user settings
export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  maxStoredProjects: MAX_STORED_PROJECTS,
  autoSave: true,
  notifications: {
    agentCompletion: true,
    errors: true,
    storageWarnings: true
  },
  ui: {
    compactMode: false,
    showTipsOnStartup: true,
    defaultComplexity: 'MVP' as const
  }
};