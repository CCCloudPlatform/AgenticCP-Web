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
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data
    return Promise.resolve(mockApiResponses.getOrganizations);
  },

  /**
   * Get organization by ID
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
   * Create organization
   */
  createOrganization: async (data: Partial<Organization>): Promise<Organization> => {
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

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
    return Promise.resolve(newOrganization);
  },

  /**
   * Update organization
   */
  updateOrganization: async (id: number, data: Partial<Organization>): Promise<Organization> => {
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
   * Delete organization
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
   * Get organization statistics
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

    // Mock stats calculation
    return Promise.resolve({
      totalProjects: 5,
      totalCost: 5400,
      activeProjects: 4,
      totalResources: 12,
    });
  },
};
