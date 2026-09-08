/**
 * Validation schemas and type guards for runtime type checking
 */

import { 
  ProductType, 
  ComplexityLevel, 
  AnalysisRequest, 
  AgentResponse,
  Blueprint,
  StoredProject,
  PRODUCT_TYPES,
  MAX_SOFTWARE_IDEA_LENGTH 
} from './index';

// Type guards for runtime type checking
export const isProductType = (value: any): value is ProductType => {
  return typeof value === 'string' && PRODUCT_TYPES.includes(value as ProductType);
};

export const isComplexityLevel = (value: any): value is ComplexityLevel => {
  return value === 'Prototype' || value === 'MVP';
};

export const isValidAnalysisRequest = (data: any): data is AnalysisRequest => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.softwareIdea === 'string' &&
    data.softwareIdea.length > 0 &&
    data.softwareIdea.length <= MAX_SOFTWARE_IDEA_LENGTH &&
    isProductType(data.productType) &&
    isComplexityLevel(data.complexityLevel)
  );
};

export const isValidAgentResponse = (data: any): data is AgentResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    typeof data.output === 'string' &&
    Array.isArray(data.keyPoints) &&
    data.keyPoints.every((point: any) => typeof point === 'string')
  );
};

export const isValidBlueprint = (data: any): data is Blueprint => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.softwareIdea === 'string' &&
    isProductType(data.productType) &&
    isComplexityLevel(data.complexityLevel) &&
    data.createdAt instanceof Date &&
    Array.isArray(data.sections) &&
    data.sections.every(isValidBlueprintSection)
  );
};

export const isValidBlueprintSection = (data: any): boolean => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.agent === 'string' &&
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    Array.isArray(data.keyPoints) &&
    data.keyPoints.every((point: any) => typeof point === 'string') &&
    data.generatedAt instanceof Date
  );
};

export const isValidStoredProject = (data: any): data is StoredProject => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.softwareIdea === 'string' &&
    isProductType(data.productType) &&
    isComplexityLevel(data.complexityLevel) &&
    typeof data.createdAt === 'string' &&
    isValidBlueprint(data.blueprint)
  );
};

// Validation functions that return error messages
export const validateSoftwareIdea = (idea: string): string[] => {
  const errors: string[] = [];
  
  if (!idea.trim()) {
    errors.push('Software idea is required');
  }
  
  if (idea.length > MAX_SOFTWARE_IDEA_LENGTH) {
    errors.push(`Software idea must be under ${MAX_SOFTWARE_IDEA_LENGTH} characters`);
  }
  
  return errors;
};

export const validateProductType = (productType: string): string[] => {
  const errors: string[] = [];
  
  if (!productType) {
    errors.push('Product type is required');
  } else if (!isProductType(productType)) {
    errors.push('Invalid product type selected');
  }
  
  return errors;
};

export const validateComplexityLevel = (complexity: string): string[] => {
  const errors: string[] = [];
  
  if (!complexity) {
    errors.push('Complexity level is required');
  } else if (!isComplexityLevel(complexity)) {
    errors.push('Invalid complexity level selected');
  }
  
  return errors;
};

// Complete form validation
export const validateAnalysisForm = (data: Partial<AnalysisRequest>): Record<string, string[]> => {
  return {
    softwareIdea: validateSoftwareIdea(data.softwareIdea || ''),
    productType: validateProductType(data.productType || ''),
    complexityLevel: validateComplexityLevel(data.complexityLevel || '')
  };
};

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeAnalysisRequest = (request: AnalysisRequest): AnalysisRequest => {
  return {
    softwareIdea: sanitizeInput(request.softwareIdea),
    productType: request.productType,
    complexityLevel: request.complexityLevel
  };
};