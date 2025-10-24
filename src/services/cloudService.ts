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

  /**
   * Update provider
   */
  updateProvider: (id: number, data: Partial<CloudProvider>): Promise<CloudProvider> => {
    return apiRequest.put<CloudProvider>(`/api/v1/cloud/providers/${id}`, data);
  },

  /**
   * Delete provider
   */
  deleteProvider: (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/cloud/providers/${id}`);
  },

  /**
   * Sync provider resources
   */
  syncProvider: (id: number): Promise<void> => {
    return apiRequest.post<void>(`/api/v1/cloud/providers/${id}/sync`);
  },

  /**
   * Test provider connection
   */
  testConnection: (
    data: Partial<CloudProvider>
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest.post<{ success: boolean; message: string }>(
      '/api/v1/cloud/providers/test',
      data
    );
  },
};
