import { apiRequest } from './api';
import { Tenant, PagedResponse, PaginationParams } from '@/types';

/**
 * Tenant Management Service
 */
export const tenantService = {
  /**
   * Get all tenants
   */
  getTenants: (params?: PaginationParams): Promise<PagedResponse<Tenant>> => {
    return apiRequest.get<PagedResponse<Tenant>>('/api/v1/tenants', { params });
  },

  /**
   * Get tenant by ID
   */
  getTenantById: (id: number): Promise<Tenant> => {
    return apiRequest.get<Tenant>(`/api/v1/tenants/${id}`);
  },

  /**
   * Create tenant
   */
  createTenant: (data: Partial<Tenant>): Promise<Tenant> => {
    return apiRequest.post<Tenant>('/api/v1/tenants', data);
  },

  /**
   * Update tenant
   */
  updateTenant: (id: number, data: Partial<Tenant>): Promise<Tenant> => {
    return apiRequest.put<Tenant>(`/api/v1/tenants/${id}`, data);
  },

  /**
   * Delete tenant
   */
  deleteTenant: (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/tenants/${id}`);
  },
};

