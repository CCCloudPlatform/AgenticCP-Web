/**
 * Common Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PagedResponse<T = unknown> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: string[];
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  tenantId?: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'CLOUD_ADMIN'
  | 'DEVELOPER'
  | 'VIEWER'
  | 'AUDITOR';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface Tenant {
  id: number;
  name: string;
  code: string;
  status: TenantStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface CloudProvider {
  id: number;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  region?: string;
  credentials?: ProviderCredentials;
  resources?: Resource[];
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProviderType = 'AWS' | 'GCP' | 'AZURE';
export type ProviderStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'CONNECTING';

export interface ProviderCredentials {
  accessKey?: string;
  secretKey?: string;
  region?: string;
  projectId?: string;
  subscriptionId?: string;
}

export interface ProviderStats {
  totalResources: number;
  runningResources: number;
  monthlyCost: number;
  lastSync: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  provider: ProviderType;
  status: ResourceStatus;
  region: string;
  tags: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type ResourceStatus = 'RUNNING' | 'STOPPED' | 'TERMINATED' | 'ERROR';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  roles?: UserRole[];
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: string;
    result?: unknown;
  };
}

export interface AgentSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

/**
 * Organization Types
 */
export interface Organization {
  id: number;
  name: string;
  description?: string;
  status: OrganizationStatus;
  totalProjects: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Project {
  id: number;
  name: string;
  description?: string;
  organizationId: number;
  organization: Organization;
  providerId: number;
  provider: CloudProvider;
  status: ProjectStatus;
  environment: ProjectEnvironment;
  resources?: Resource[];
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED';
export type ProjectEnvironment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'TESTING';
