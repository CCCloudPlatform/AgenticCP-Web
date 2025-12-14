import { apiRequest } from './api';
import { CloudProvider, Resource, PagedResponse, PaginationParams } from '@/types';

/**
 * Cloud Management Service
 */
export const cloudService = {
  /**
   * Get cloud providers
   */
  getProviders: (params?: PaginationParams): Promise<PagedResponse<CloudProvider>> => {
    return apiRequest.get<PagedResponse<CloudProvider>>('/api/v1/cloud/providers', { params });
  },

  /**
   * Get provider by ID
   */
  getProviderById: (id: number): Promise<CloudProvider> => {
    return apiRequest.get<CloudProvider>(`/api/v1/cloud/providers/${id}`);
  },

  /**
   * Create provider
   */
  createProvider: (data: Partial<CloudProvider>): Promise<CloudProvider> => {
    return apiRequest.post<CloudProvider>('/api/v1/cloud/providers', data);
  },

  /**
   * Get resources
   */
  getResources: (params?: PaginationParams): Promise<PagedResponse<Resource>> => {
    return apiRequest.get<PagedResponse<Resource>>('/api/v1/cloud/resources', { params });
  },

  /**
   * Get resource by ID
   */
  getResourceById: (id: number): Promise<Resource> => {
    return apiRequest.get<Resource>(`/api/v1/cloud/resources/${id}`);
  },
};

