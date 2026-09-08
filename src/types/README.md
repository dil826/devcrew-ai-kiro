# DevCrew AI - Type Definitions

This directory contains all TypeScript interfaces and types for the DevCrew AI multi-agent system.

## Structure

- **`index.ts`** - Main export file for all types
- **`common.ts`** - Shared types used across the application
- **`agent.ts`** - Agent-related interfaces and the multi-agent workflow
- **`blueprint.ts`** - Development blueprint and project data models
- **`api.ts`** - API request/response types for client-server communication
- **`storage.ts`** - Local storage schema and data persistence interfaces
- **`components.ts`** - React component props and UI-related types
- **`constants.ts`** - Application constants and agent configurations
- **`validation.ts`** - Type guards and validation functions

## Usage

Import types from the main index file:

```typescript
import { 
  AnalysisRequest, 
  AgentStatus, 
  Blueprint, 
  ProductType 
} from '@/types';
```

## Key Types

### Core Workflow Types
- `AnalysisRequest` - User input for blueprint generation
- `AgentStatus` - Real-time agent execution status
- `Blueprint` - Complete development plan output
- `AnalysisSession` - Multi-agent workflow tracking

### Agent System
- `AgentConfig` - Configuration for each of the 6 agents
- `AgentResponse` - Output from individual agents
- `AgentContext` - Data passed between agents

### Storage & Persistence
- `StoredProject` - Complete project data for local storage
- `LocalStorageSchema` - Full browser storage structure
- `ProjectSummary` - Project listing for history

### API Communication
- `AnalysisResponse` - Server response structure
- `GeminiAPIRequest/Response` - External API integration
- `StatusUpdate` - Real-time progress updates

## Validation

The validation module provides runtime type checking:

```typescript
import { isValidAnalysisRequest, validateAnalysisForm } from '@/types';

// Runtime type checking
if (isValidAnalysisRequest(data)) {
  // data is confirmed to be AnalysisRequest
}

// Form validation with error messages
const errors = validateAnalysisForm(formData);
```

## Constants

Pre-defined values for consistent application behavior:

- `AGENT_CONFIGS` - Configuration for all 6 agents
- `PRODUCT_TYPES` - Available software product types
- `EXAMPLE_SOFTWARE_IDEAS` - Sample ideas for user guidance
- `MAX_SOFTWARE_IDEA_LENGTH` - Character limit (2000)
- `MAX_STORED_PROJECTS` - Local storage limit (10)