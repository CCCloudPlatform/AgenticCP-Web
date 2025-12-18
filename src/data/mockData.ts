import { ApiResponse, CloudProvider, Organization, OrganizationTenant, Project, Resource } from '@/types';

/**
 * E-Commerce Platform Organization Structure
 * 조직: E-커머스 플랫폼
 * 프로젝트들: 각각 하나의 프로바이더를 가짐
 */

/**
 * Mock Organizations Data
 */
export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: 'E-Commerce Platform Organization',
    description: '온라인 쇼핑몰 플랫폼의 전체 인프라 및 서비스 관리',
    status: 'ACTIVE',
    totalProjects: 8,
    totalCost: 5400,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: '모바일 애플리케이션 개발 및 운영 조직',
    status: 'ACTIVE',
    totalProjects: 3,
    totalCost: 1200,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 3,
    name: 'Data Analytics Team',
    description: '데이터 분석 및 머신러닝 팀',
    status: 'ACTIVE',
    totalProjects: 2,
    totalCost: 800,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
  {
    id: 4,
    name: 'Legacy Systems',
    description: '레거시 시스템 관리 및 마이그레이션',
    status: 'INACTIVE',
    totalProjects: 1,
    totalCost: 0,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-10T13:45:00Z',
  },
  {
    id: 5,
    name: '개발팀',
    description: '내부 개발팀 조직',
    status: 'ACTIVE',
    totalProjects: 1,
    totalCost: 0,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
];

/**
 * Mock Cloud Providers Data for E-Commerce Platform
 */
export const mockProviders: CloudProvider[] = [
  {
    id: 1,
    name: 'E-Commerce Production AWS',
    type: 'AWS',
    status: 'ACTIVE',
    region: 'us-east-1',
    credentials: {
      accessKey: 'AKIA...',
      secretKey: '***',
      region: 'us-east-1',
    },
    resources: [],
    cost: 2500,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 2,
    name: 'E-Commerce Development GCP',
    type: 'GCP',
    status: 'ACTIVE',
    region: 'asia-northeast-1',
    credentials: {
      projectId: 'ecommerce-dev-123',
      region: 'asia-northeast-1',
    },
    resources: [],
    cost: 1200,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: 3,
    name: 'E-Commerce Staging Azure',
    type: 'AZURE',
    status: 'ACTIVE',
    region: 'eastus',
    credentials: {
      subscriptionId: 'ecommerce-sub-123',
      region: 'eastus',
    },
    resources: [],
    cost: 800,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
  {
    id: 4,
    name: 'E-Commerce Analytics AWS',
    type: 'AWS',
    status: 'ACTIVE',
    region: 'us-west-2',
    credentials: {
      accessKey: 'AKIA...',
      secretKey: '***',
      region: 'us-west-2',
    },
    resources: [],
    cost: 600,
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 5,
    name: 'E-Commerce CDN GCP',
    type: 'GCP',
    status: 'ACTIVE',
    region: 'global',
    credentials: {
      projectId: 'ecommerce-cdn-456',
      region: 'global',
    },
    resources: [],
    cost: 300,
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
];

/**
 * Mock Resources Data for E-Commerce Platform Projects
 * 인벤토리에는 서버(EC2/Compute Engine/VM), 스토리지(S3/Cloud Storage), 네트워크(VPC)만 표시
 */
export const mockResources: Resource[] = [
  // Frontend Web Application Resources (AWS)
  // 서버
  {
    id: 1,
    name: 'ecommerce-web-frontend',
    type: 'EC2',
    provider: 'AWS',
    providerId: 1, // E-Commerce Production AWS
    status: 'RUNNING',
    region: 'us-east-1',
    cost: 150,
    tags: { Environment: 'Production', Project: 'Frontend Web App' },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  // 스토리지
  {
    id: 2,
    name: 'ecommerce-web-assets',
    type: 'S3',
    provider: 'AWS',
    providerId: 1, // E-Commerce Production AWS
    status: 'RUNNING',
    region: 'us-east-1',
    cost: 80,
    tags: { Environment: 'Production', Project: 'Frontend Web App' },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  // 네트워크
  {
    id: 3,
    name: 'ecommerce-production-vpc',
    type: 'VPC',
    provider: 'AWS',
    providerId: 1, // E-Commerce Production AWS
    status: 'RUNNING',
    region: 'us-east-1',
    cost: 320,
    tags: { Environment: 'Production', Project: 'Frontend Web App' },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },

  // Backend API Services Resources (GCP)
  // 서버
  {
    id: 4,
    name: 'ecommerce-api-server',
    type: 'Compute Engine',
    provider: 'GCP',
    providerId: 2, // E-Commerce Development GCP
    status: 'RUNNING',
    region: 'asia-northeast-1',
    cost: 120,
    tags: { Environment: 'Development', Project: 'Backend API Services' },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  // 스토리지
  {
    id: 5,
    name: 'ecommerce-api-backups',
    type: 'Cloud Storage',
    provider: 'GCP',
    providerId: 2, // E-Commerce Development GCP
    status: 'RUNNING',
    region: 'asia-northeast-1',
    cost: 280,
    tags: { Environment: 'Development', Project: 'Backend API Services' },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  // 네트워크
  {
    id: 6,
    name: 'ecommerce-development-vpc',
    type: 'VPC',
    provider: 'GCP',
    providerId: 2, // E-Commerce Development GCP
    status: 'RUNNING',
    region: 'asia-northeast-1',
    cost: 450,
    tags: { Environment: 'Development', Project: 'Backend API Services' },
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },

  // Staging Environment Resources (Azure)
  // 서버
  {
    id: 7,
    name: 'ecommerce-staging-vm',
    type: 'Virtual Machine',
    provider: 'AZURE',
    providerId: 3, // E-Commerce Staging Azure
    status: 'RUNNING',
    region: 'eastus',
    cost: 180,
    tags: { Environment: 'Staging', Project: 'Staging Environment' },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
  // 스토리지
  {
    id: 8,
    name: 'ecommerce-staging-storage',
    type: 'Storage Account',
    provider: 'AZURE',
    providerId: 3, // E-Commerce Staging Azure
    status: 'RUNNING',
    region: 'eastus',
    cost: 250,
    tags: { Environment: 'Staging', Project: 'Staging Environment' },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },

  // Analytics & Data Processing Resources (AWS)
  // 서버
  {
    id: 10,
    name: 'ecommerce-analytics-server',
    type: 'EC2',
    provider: 'AWS',
    providerId: 4, // E-Commerce Analytics AWS
    status: 'RUNNING',
    region: 'us-west-2',
    cost: 580,
    tags: { Environment: 'Production', Project: 'Analytics & Data Processing' },
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  // 스토리지
  {
    id: 11,
    name: 'ecommerce-data-lake',
    type: 'S3',
    provider: 'AWS',
    providerId: 4, // E-Commerce Analytics AWS
    status: 'RUNNING',
    region: 'us-west-2',
    cost: 120,
    tags: { Environment: 'Production', Project: 'Analytics & Data Processing' },
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },

  // CDN & Content Delivery Resources (GCP)
  // 스토리지
  {
    id: 13,
    name: 'ecommerce-static-assets',
    type: 'Cloud Storage',
    provider: 'GCP',
    providerId: 5, // E-Commerce CDN GCP
    status: 'RUNNING',
    region: 'global',
    cost: 350,
    tags: { Environment: 'Production', Project: 'CDN & Content Delivery' },
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
  // 네트워크
  {
    id: 14,
    name: 'ecommerce-cdn-vpc',
    type: 'VPC',
    provider: 'GCP',
    providerId: 5, // E-Commerce CDN GCP
    status: 'RUNNING',
    region: 'global',
    cost: 90,
    tags: { Environment: 'Production', Project: 'CDN & Content Delivery' },
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
];

/**
 * Mock Projects Data for E-Commerce Platform Organization
 * 각 프로젝트는 하나의 프로바이더를 가짐
 */
export const mockProjects: Project[] = [
  {
    id: 1,
    name: 'Frontend Web Application',
    description: 'E-커머스 플랫폼의 사용자 인터페이스 및 웹 애플리케이션',
    organizationId: 1,
    organization: mockOrganizations[0], // E-Commerce Platform Organization
    providerId: 1,
    provider: mockProviders[0], // E-Commerce Production AWS
    status: 'ACTIVE',
    environment: 'PRODUCTION',
    resources: mockResources.filter((r) => r.tags.Project === 'Frontend Web App'),
    cost: 2500,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 2,
    name: 'Backend API Services',
    description: 'E-커머스 플랫폼의 백엔드 API 및 마이크로서비스',
    organizationId: 1,
    organization: mockOrganizations[0], // E-Commerce Platform Organization
    providerId: 2,
    provider: mockProviders[1], // E-Commerce Development GCP
    status: 'ACTIVE',
    environment: 'DEVELOPMENT',
    resources: mockResources.filter((r) => r.tags.Project === 'Backend API Services'),
    cost: 1200,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: 3,
    name: 'Staging Environment',
    description: 'E-커머스 플랫폼의 스테이징 및 테스트 환경',
    organizationId: 1,
    organization: mockOrganizations[0], // E-Commerce Platform Organization
    providerId: 3,
    provider: mockProviders[2], // E-Commerce Staging Azure
    status: 'ACTIVE',
    environment: 'STAGING',
    resources: mockResources.filter((r) => r.tags.Project === 'Staging Environment'),
    cost: 800,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
  },
  {
    id: 4,
    name: 'Analytics & Data Processing',
    description: 'E-커머스 플랫폼의 데이터 분석 및 처리 시스템',
    organizationId: 3,
    organization: mockOrganizations[2], // Data Analytics Team
    providerId: 4,
    provider: mockProviders[3], // E-Commerce Analytics AWS
    status: 'ACTIVE',
    environment: 'PRODUCTION',
    resources: mockResources.filter((r) => r.tags.Project === 'Analytics & Data Processing'),
    cost: 600,
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 5,
    name: 'CDN & Content Delivery',
    description: 'E-커머스 플랫폼의 콘텐츠 전송 네트워크 및 정적 자산 관리',
    organizationId: 1,
    organization: mockOrganizations[0], // E-Commerce Platform Organization
    providerId: 5,
    provider: mockProviders[4], // E-Commerce CDN GCP
    status: 'ACTIVE',
    environment: 'PRODUCTION',
    resources: mockResources.filter((r) => r.tags.Project === 'CDN & Content Delivery'),
    cost: 300,
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
  {
    id: 6,
    name: 'Payment Gateway Integration',
    description: 'E-커머스 플랫폼의 결제 시스템 통합 (개발 중)',
    organizationId: 1,
    organization: mockOrganizations[0], // E-Commerce Platform Organization
    providerId: 2,
    provider: mockProviders[1], // E-Commerce Development GCP
    status: 'INACTIVE',
    environment: 'DEVELOPMENT',
    resources: [],
    cost: 0,
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: 7,
    name: 'Mobile App Backend',
    description: 'E-커머스 플랫폼의 모바일 애플리케이션 백엔드 서비스',
    organizationId: 2,
    organization: mockOrganizations[1], // Mobile App Development
    providerId: 3,
    provider: mockProviders[2], // E-Commerce Staging Azure
    status: 'SUSPENDED',
    environment: 'STAGING',
    resources: [],
    cost: 200,
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-25T10:15:00Z',
  },
  {
    id: 8,
    name: 'Legacy System Migration',
    description: 'E-커머스 플랫폼의 레거시 시스템 클라우드 마이그레이션 (완료)',
    organizationId: 4,
    organization: mockOrganizations[3], // Legacy Systems
    providerId: 1,
    provider: mockProviders[0], // E-Commerce Production AWS
    status: 'ARCHIVED',
    environment: 'PRODUCTION',
    resources: [],
    cost: 0,
    createdAt: '2023-12-20T16:00:00Z',
    updatedAt: '2024-01-10T13:45:00Z',
  },
];

/**
 * Mock API Responses
 */
export const mockApiResponses = {
  getProjects: {
    content: mockProjects,
    page: 0,
    size: 10,
    totalElements: mockProjects.length,
    totalPages: 1,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  },
  getProviders: {
    content: mockProviders,
    page: 0,
    size: 10,
    totalElements: mockProviders.length,
    totalPages: 1,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  },
  getOrganizations: {
    content: mockOrganizations,
    page: 0,
    size: 10,
    totalElements: mockOrganizations.length,
    totalPages: 1,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  },
};

/**
 * Mock Organization Tenant for "개발팀" (organizationId: 5)
 */
export const mockOrganizationTenantResponse: ApiResponse<OrganizationTenant> = {
  success: true,
  message: '조직 테넌트를 성공적으로 조회했습니다.',
  data: {
    // BaseEntity fields
    id: 1,
    createdAt: '2024-01-01T10:00:00',
    updatedAt: '2024-01-15T14:30:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    isDeleted: false,

    // Tenant basic info
    tenantKey: 'org-dev-team-001',
    tenantName: '개발팀 전용 테넌트',
    description: '개발팀의 전용 클라우드 환경',

    // Organization relation (1:1)
    organization: {
      id: 5,
      name: '개발팀',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-15T14:30:00',
      createdBy: 'admin',
      updatedBy: 'admin',
      isDeleted: false,
    },

    // Status & type
    status: 'ACTIVE',
    tenantType: 'DEDICATED',

    // Resource quotas
    maxUsers: 100,
    maxResources: 50,
    storageQuotaGb: 1000,
    bandwidthQuotaGb: 500,

    // Contact info
    contactEmail: 'dev-team@example.com',
    contactPhone: '010-1234-5678',

    // Billing info
    billingAddress: '서울시 강남구 테헤란로 123, 10층',

    // Settings (JSON string)
    settings:
      '{"theme":"dark","language":"ko","timezone":"Asia/Seoul","notifications":{"email":true,"sms":false}}',

    // Subscription info
    subscriptionStartDate: '2024-01-01T00:00:00',
    subscriptionEndDate: '2024-12-31T23:59:59',

    // Trial info
    isTrial: false,
    trialEndDate: null,
  },
  timestamp: new Date().toISOString(),
};

/**
 * Mock Statistics for E-Commerce Platform Organization
 */
export const mockStats = {
  totalProjects: mockProjects.length,
  activeProjects: mockProjects.filter((p) => p.status === 'ACTIVE').length,
  totalResources: mockProjects.reduce((sum, p) => sum + (p.resources?.length || 0), 0),
  totalCost: mockProjects.reduce((sum, p) => sum + (p.cost || 0), 0),
  projectsByStatus: {
    ACTIVE: mockProjects.filter((p) => p.status === 'ACTIVE').length,
    INACTIVE: mockProjects.filter((p) => p.status === 'INACTIVE').length,
    SUSPENDED: mockProjects.filter((p) => p.status === 'SUSPENDED').length,
    ARCHIVED: mockProjects.filter((p) => p.status === 'ARCHIVED').length,
  },
  projectsByEnvironment: {
    DEVELOPMENT: mockProjects.filter((p) => p.environment === 'DEVELOPMENT').length,
    STAGING: mockProjects.filter((p) => p.environment === 'STAGING').length,
    PRODUCTION: mockProjects.filter((p) => p.environment === 'PRODUCTION').length,
    TESTING: mockProjects.filter((p) => p.environment === 'TESTING').length,
  },
  projectsByProvider: {
    AWS: mockProjects.filter((p) => p.provider.type === 'AWS').length,
    GCP: mockProjects.filter((p) => p.provider.type === 'GCP').length,
    AZURE: mockProjects.filter((p) => p.provider.type === 'AZURE').length,
  },
  organizationInfo: {
    name: 'E-Commerce Platform Organization',
    description: '온라인 쇼핑몰 플랫폼의 전체 인프라 및 서비스 관리',
    totalProviders: mockProviders.length,
    totalResources: mockResources.length,
    monthlyCost: mockProjects.reduce((sum, p) => sum + (p.cost || 0), 0),
    lastUpdated: '2024-01-25T10:15:00Z',
  },
};
