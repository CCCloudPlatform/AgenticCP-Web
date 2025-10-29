import { apiRequest } from './api';
import { 
  Organization, 
  OrganizationResponse,
  OrganizationHierarchyResponse,
  OrganizationPathResponse,
  OrganizationStatsResponse,
  OrganizationMember,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  MoveOrganizationRequest,
  AddUserToOrganizationRequest,
  Tenant,
  User,
  ApiResponse,
  PagedResponse,
  PaginationParams
} from '@/types';

/**
 * Organization Management Service
 */
export const organizationService = {
  /**
   * Create organization
   */
  createOrganization: (data: CreateOrganizationRequest): Promise<OrganizationResponse> => {
    return apiRequest.post<OrganizationResponse>('/api/organizations', data);
  },

  /**
   * Get organization by ID
   */
  getOrganizationById: (id: number): Promise<OrganizationResponse> => {
    return apiRequest.get<OrganizationResponse>(`/api/organizations/${id}`);
  },

  /**
   * Get all organizations
   */
  getOrganizations: (params?: PaginationParams): Promise<PagedResponse<OrganizationResponse>> => {
    return apiRequest.get<PagedResponse<OrganizationResponse>>('/api/organizations', { params });
  },

  /**
   * Update organization
   */
  updateOrganization: (id: number, data: UpdateOrganizationRequest): Promise<OrganizationResponse> => {
    return apiRequest.put<OrganizationResponse>(`/api/organizations/${id}`, data);
  },

  /**
   * Delete organization
   */
  deleteOrganization: (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/organizations/${id}`);
  },

  /**
   * Get organization count
   */
  getOrganizationCount: (): Promise<number> => {
    return apiRequest.get<number>('/api/organizations/count');
  },

  /**
   * Get organization statistics
   */
  getOrganizationStats: (): Promise<OrganizationStatsResponse> => {
    return apiRequest.get<OrganizationStatsResponse>('/api/organizations/stats');
  },

  /**
   * Get children organizations
   */
  getChildrenOrganizations: (id: number): Promise<OrganizationResponse[]> => {
    return apiRequest.get<OrganizationResponse[]>(`/api/organizations/${id}/children`);
  },

  /**
   * Get organization tree
   */
  getOrganizationTree: (): Promise<OrganizationHierarchyResponse[]> => {
    return apiRequest.get<OrganizationHierarchyResponse[]>('/api/organizations/tree');
  },

  /**
   * Get organization path
   */
  getOrganizationPath: (id: number): Promise<OrganizationPathResponse> => {
    return apiRequest.get<OrganizationPathResponse>(`/api/organizations/${id}/path`);
  },

  /**
   * Get ancestor organizations
   */
  getAncestorOrganizations: (id: number): Promise<OrganizationResponse[]> => {
    return apiRequest.get<OrganizationResponse[]>(`/api/organizations/${id}/ancestors`);
  },

  /**
   * Get descendant organizations
   */
  getDescendantOrganizations: (id: number): Promise<OrganizationResponse[]> => {
    return apiRequest.get<OrganizationResponse[]>(`/api/organizations/${id}/descendants`);
  },

  /**
   * Move organization
   */
  moveOrganization: (id: number, data: MoveOrganizationRequest): Promise<OrganizationResponse> => {
    return apiRequest.put<OrganizationResponse>(`/api/organizations/${id}/move`, data);
  },

  /**
   * Get organization members
   */
  getOrganizationMembers: (id: number): Promise<OrganizationMember[]> => {
    return apiRequest.get<OrganizationMember[]>(`/api/organizations/${id}/users`);
  },

  /**
   * Add user to organization
   */
  addUserToOrganization: (id: number, data: AddUserToOrganizationRequest): Promise<User> => {
    return apiRequest.post<User>(`/api/organizations/${id}/users`, data);
  },

  /**
   * Remove user from organization
   */
  removeUserFromOrganization: (id: number, userId: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/organizations/${id}/users/${userId}`);
  },

  /**
   * Get organization tenants
   */
  getOrganizationTenants: (id: number): Promise<Tenant[]> => {
    return apiRequest.get<Tenant[]>(`/api/organizations/${id}/tenants`);
  },

  /**
   * Get organization tenants count
   */
  getOrganizationTenantsCount: (id: number): Promise<Record<string, any>> => {
    return apiRequest.get<Record<string, any>>(`/api/organizations/${id}/tenants/count`);
  },

  /**
   * Get organization tenants statistics
   */
  getOrganizationTenantsStats: (id: number): Promise<Record<string, any>> => {
    return apiRequest.get<Record<string, any>>(`/api/organizations/${id}/tenants/stats`);
  },
};
