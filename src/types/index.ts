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
  providerId?: number; // 프로바이더 인스턴스 ID
  status: ResourceStatus;
  region: string;
  cost?: number;
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
  members?: OrganizationMember[];
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

/**
 * Organization Tenant Types
 */
export interface OrganizationTenant {
  // BaseEntity 필드 (상속)
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;

  // Tenant 기본 정보
  tenantKey: string;
  tenantName: string;
  description: string;

  // 조직 관계 (1:1)
  organization: OrganizationBasic;

  // 테넌트 상태 및 타입
  status: TenantStatusType;
  tenantType: TenantType;

  // 리소스 할당량
  maxUsers: number;
  maxResources: number;
  storageQuotaGb: number;
  bandwidthQuotaGb: number;

  // 연락처 정보
  contactEmail: string;
  contactPhone: string;

  // 과금 정보
  billingAddress: string;

  // 테넌트 설정 (JSON 문자열)
  settings: string;

  // 구독 정보
  subscriptionStartDate: string;
  subscriptionEndDate: string;

  // 트라이얼 정보
  isTrial: boolean;
  trialEndDate: string | null;
}

export interface OrganizationBasic {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
}

export type TenantStatusType = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type TenantType = 'DEDICATED' | 'SHARED' | 'TRIAL';

/**
 * Organization Member Types
 */
export interface OrganizationMember {
  id?: number;
  name: string;
  email: string;
  role: OrganizationMemberRole;
}

export type OrganizationMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

/**
 * Organization Create/Update Request
 */
export interface OrganizationCreateRequest {
  name: string;
  description?: string;
  status?: OrganizationStatus;
  members?: OrganizationMember[];
}

export interface OrganizationUpdateRequest {
  name?: string;
  description?: string;
  status?: OrganizationStatus;
  members?: OrganizationMember[];
}
