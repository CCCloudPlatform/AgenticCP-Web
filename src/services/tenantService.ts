import { apiRequest } from './api';
import { ApiResponse, OrganizationTenant, PagedResponse, PaginationParams, Tenant } from '@/types';
import { mockOrganizationTenantResponse } from '@/data/mockData';

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

  /**
   * Get tenant of an organization
   */
  getOrganizationTenant: (organizationId: number): Promise<ApiResponse<OrganizationTenant>> => {
    // 개발 편의를 위한 목업: organizationId가 5(개발팀)일 때만 테넌트 반환
    if (organizationId === 5) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockOrganizationTenantResponse), 300);
      });
    }

    // 다른 조직은 테넌트가 없는 것처럼 처리 (404 대신 success true + data undefined 형태를 원하면 여기서 조정)
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tenant not found for this organization')), 300);
    });
  },
};

