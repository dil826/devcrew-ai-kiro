/**
 * Component-specific types and React props interfaces
 */

import { ReactNode } from 'react';
import { 
  AnalysisRequest, 
  ProductType, 
  ComplexityLevel, 
  AgentStatus, 
  Blueprint, 
  ProjectSummary 
} from './index';

// Main application shell props
export interface AppShellProps {
  children: ReactNode;
}

// Software idea form component props
export interface SoftwareIdeaFormProps {
  onSubmit: (data: AnalysisRequest) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<AnalysisRequest>;
}

// Form state for software idea input
export interface SoftwareIdeaFormState {
  softwareIdea: string;
  productType: ProductType | '';
  complexityLevel: ComplexityLevel | '';
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Agent status monitor props
export interface AgentStatusMonitorProps {
  agents: AgentStatus[];
  currentAgent: number;
  className?: string;
}

// Blueprint viewer component props
export interface BlueprintViewerProps {
  blueprint: Blueprint | null;
  onDownload?: () => void;
  className?: string;
}

// Project history component props
export interface ProjectHistoryProps {
  projects: ProjectSummary[];
  onSelectProject: (id: string) => void;
  onClearHistory: () => void;
  className?: string;
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  errorId?: string;
}

// Loading spinner props
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

// Modal component props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

// Toast notification props
export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Button component props
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Form field props
export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
}