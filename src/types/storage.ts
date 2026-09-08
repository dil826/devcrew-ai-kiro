/**
 * Local storage schema interfaces and data persistence types
 */

import { StoredProject, ProjectSummary } from './blueprint';
import { Theme } from './common';

// Complete local storage schema
export interface LocalStorageSchema {
  projects: StoredProject[];
  settings: UserSettings;
  cache: CacheData;
  metadata: StorageMetadata;
}

// User preferences and application settings
export interface UserSettings {
  theme: Theme;
  maxStoredProjects: number;
  autoSave: boolean;
  notifications: {
    agentCompletion: boolean;
    errors: boolean;
    storageWarnings: boolean;
  };
  ui: {
    compactMode: boolean;
    showTipsOnStartup: boolean;
    defaultComplexity: 'Prototype' | 'MVP';
  };
}

// Cache data for improved performance
export interface CacheData {
  agentConfigs?: Record<string, any>;
  lastUsedProductTypes: string[];
  exampleSoftwareIdeas: string[];
  lastCleanupDate: string;
}

// Storage metadata for management and debugging
export interface StorageMetadata {
  version: string;
  lastUpdated: string;
  totalProjects: number;
  storageUsed: number; // bytes
  storageQuota: number; // bytes
}

// Storage operations interface
export interface StorageOperations {
  save: <T>(key: string, data: T) => Promise<void>;
  load: <T>(key: string) => Promise<T | null>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getSize: () => Promise<number>;
  isAvailable: () => boolean;
}

// Project storage specific operations
export interface ProjectStorage {
  saveProject: (project: StoredProject) => Promise<void>;
  loadProject: (id: string) => Promise<StoredProject | null>;
  deleteProject: (id: string) => Promise<void>;
  listProjects: () => Promise<ProjectSummary[]>;
  clearOldProjects: (keepCount: number) => Promise<void>;
  getStorageStats: () => Promise<StorageStats>;
}

// Storage statistics and quota information
export interface StorageStats {
  totalProjects: number;
  totalSize: number;
  availableSpace: number;
  quotaExceeded: boolean;
  oldestProject?: Date;
  newestProject?: Date;
}

// Storage error types
export interface StorageError {
  type: 'quota_exceeded' | 'not_available' | 'corruption' | 'permission_denied';
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
}

// Migration interface for handling schema updates
export interface StorageMigration {
  fromVersion: string;
  toVersion: string;
  migrate: (oldData: any) => LocalStorageSchema;
  validate: (data: any) => boolean;
}

// Storage event types for change notifications
export type StorageEventType = 'project_added' | 'project_removed' | 'settings_updated' | 'quota_warning';

export interface StorageEvent {
  type: StorageEventType;
  timestamp: Date;
  data?: any;
}