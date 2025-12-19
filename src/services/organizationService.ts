import {
  Organization,
  PagedResponse,
  PaginationParams,
  OrganizationTenant,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from '@/types';
import { mockApiResponses, mockOrganizations, mockOrganizationTenants } from '@/data/mockData';

/**
 * Organization Management Service
 */
export const organizationService = {
  /**
   * Get all organizations (조직 목록 조회)
   */
  getOrganizations: async (_params?: PaginationParams): Promise<PagedResponse<Organization>> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data
    return Promise.resolve(mockApiResponses.getOrganizations);
  },

  /**
   * Get organization by ID (조직 조회)
   */
  getOrganizationById: async (id: number): Promise<Organization> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const organization = mockOrganizations.find((o) => o.id === id);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return Promise.resolve(organization);
  },

  /**
   * Create organization (조직 생성)
   */
  createOrganization: async (data: OrganizationCreateRequest): Promise<Organization> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newOrganization: Organization = {
      id: mockOrganizations.length + 1,
      name: data.name,
      description: data.description || '',
      status: data.status || 'ACTIVE',
      totalProjects: 0,
      totalCost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrganizations.push(newOrganization);
    return Promise.resolve(newOrganization);
  },

  /**
   * Update organization (조직 수정)
   */
  updateOrganization: async (id: number, data: OrganizationUpdateRequest): Promise<Organization> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const organizationIndex = mockOrganizations.findIndex((o) => o.id === id);
    if (organizationIndex === -1) {
      throw new Error('Organization not found');
    }

    const updatedOrganization = {
      ...mockOrganizations[organizationIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockOrganizations[organizationIndex] = updatedOrganization;
    return Promise.resolve(updatedOrganization);
  },

  /**
   * Delete organization (조직 삭제)
   */
  deleteOrganization: async (id: number): Promise<void> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const organizationIndex = mockOrganizations.findIndex((o) => o.id === id);
    if (organizationIndex === -1) {
      throw new Error('Organization not found');
    }

    mockOrganizations.splice(organizationIndex, 1);
    return Promise.resolve();
  },

  /**
   * Get organization count (조직 수 조회)
   */
  getOrganizationCount: async (): Promise<number> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return Promise.resolve(mockOrganizations.length);
  },

  /**
   * Get organization tenant (조직의 테넌트 조회)
   */
  getOrganizationTenant: async (organizationId: number): Promise<OrganizationTenant | null> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const tenant = mockOrganizationTenants.find(
      (t) => t.organization.id === organizationId
    );

    return Promise.resolve(tenant || null);
  },

  /**
   * Check if organization has tenant (조직 테넌트 존재 여부 조회)
   */
  checkOrganizationTenantExists: async (organizationId: number): Promise<boolean> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const tenant = mockOrganizationTenants.find(
      (t) => t.organization.id === organizationId
    );

    return Promise.resolve(!!tenant);
  },

  /**
   * Get organization statistics (조직 통계 조회)
   */
  getOrganizationStats: async (
    id: number
  ): Promise<{
    totalProjects: number;
    totalCost: number;
    activeProjects: number;
    totalResources: number;
  }> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const organization = mockOrganizations.find((o) => o.id === id);
    if (!organization) {
      throw new Error('Organization not found');
    }

    // Mock stats calculation
    return Promise.resolve({
      totalProjects: organization.totalProjects,
      totalCost: organization.totalCost,
      activeProjects: Math.floor(organization.totalProjects * 0.8),
      totalResources: organization.totalProjects * 3,
    });
  },
};
