import { Organization, PagedResponse, PaginationParams } from '@/types';
import { mockApiResponses, mockOrganizations } from '@/data/mockData';

/**
 * Organization Management Service
 */
export const organizationService = {
  /**
   * Get all organizations
   */
  getOrganizations: async (_params?: PaginationParams): Promise<PagedResponse<Organization>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Promise.resolve(mockApiResponses.getOrganizations);
  },

  /**
   * Get organization by ID
   */
  getOrganizationById: async (id: number): Promise<Organization> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const organization = mockOrganizations.find((o) => o.id === id);
    if (!organization) {
      throw new Error('Organization not found');
    }
    return Promise.resolve(organization);
  },

  /**
   * Create organization
   */
  createOrganization: async (data: Partial<Organization>): Promise<Organization> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newOrganization: Organization = {
      id: mockOrganizations.length + 1,
      name: data.name || 'New Organization',
      description: data.description || '',
      status: data.status || 'ACTIVE',
      totalProjects: 0,
      totalCost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrganizations.push(newOrganization);
    mockApiResponses.getOrganizations = {
      ...mockApiResponses.getOrganizations,
      content: mockOrganizations,
      totalElements: mockOrganizations.length,
    };

    return Promise.resolve(newOrganization);
  },

  /**
   * Update organization
   */
  updateOrganization: async (id: number, data: Partial<Organization>): Promise<Organization> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockOrganizations.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error('Organization not found');
    }

    const updated: Organization = {
      ...mockOrganizations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockOrganizations[index] = updated;
    mockApiResponses.getOrganizations = {
      ...mockApiResponses.getOrganizations,
      content: mockOrganizations,
      totalElements: mockOrganizations.length,
    };

    return Promise.resolve(updated);
  },

  /**
   * Delete organization
   */
  deleteOrganization: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const index = mockOrganizations.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error('Organization not found');
    }

    mockOrganizations.splice(index, 1);
    mockApiResponses.getOrganizations = {
      ...mockApiResponses.getOrganizations,
      content: mockOrganizations,
      totalElements: mockOrganizations.length,
    };

    return Promise.resolve();
  },

  /**
   * Get organization count
   */
  getOrganizationCount: async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return Promise.resolve(mockOrganizations.length);
  },

  /**
   * Get organization statistics
   */
  getOrganizationStats: (
    id: number
  ): Promise<{
    totalProjects: number;
    totalCost: number;
    activeProjects: number;
    totalResources: number;
  }> => {
    // 간단한 목업 통계 (실제 로직은 백엔드에서 계산)
    const organization = mockOrganizations.find((o) => o.id === id);
    if (!organization) {
      return Promise.reject(new Error('Organization not found'));
    }

    return Promise.resolve({
      totalProjects: organization.totalProjects,
      totalCost: organization.totalCost,
      activeProjects: organization.totalProjects, // 단순 가정
      totalResources: organization.totalProjects * 3,
    });
  },
};
