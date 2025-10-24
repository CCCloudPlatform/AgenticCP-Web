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
  totpCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data: LoginResponse;
  timestamp: string;
}

export interface LoginErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string | null;
  };
  timestamp: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  tenantKey?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface RegisterApiResponse {
  success: boolean;
  message: string;
  data: RegisterResponse;
  timestamp: string;
}

export interface RegisterErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field?: string;
      value?: string;
    } | null;
  };
  timestamp: string;
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
  createdAt: string;
  updatedAt: string;
}

export type ProviderType = 'AWS' | 'GCP' | 'AZURE';
export type ProviderStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR';

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

