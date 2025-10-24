import { apiRequest } from './api';
import { 
  Role, 
  Permission, 
  RoleCreateRequest, 
  RoleUpdateRequest, 
  PermissionCreateRequest, 
  PermissionUpdateRequest,
  ApiResponse 
} from '@/types';

/**
 * Role & Permission Management Service
 */
export const rolePermissionService = {
  /**
   * Role Management APIs
   */

  /**
   * Get all roles
   */
  getRoles: (): Promise<ApiResponse<Role[]>> => {
    return apiRequest.get<ApiResponse<Role[]>>('/api/v1/roles');
  },

  /**
   * Get active roles only
   */
  getActiveRoles: (): Promise<ApiResponse<Role[]>> => {
    return apiRequest.get<ApiResponse<Role[]>>('/api/v1/roles/active');
  },

  /**
   * Get system roles
   */
  getSystemRoles: (): Promise<ApiResponse<Role[]>> => {
    return apiRequest.get<ApiResponse<Role[]>>('/api/v1/roles/system');
  },

  /**
   * Get default roles
   */
  getDefaultRoles: (): Promise<ApiResponse<Role[]>> => {
    return apiRequest.get<ApiResponse<Role[]>>('/api/v1/roles/default');
  },

  /**
   * Get role by key
   */
  getRoleByKey: (roleKey: string): Promise<ApiResponse<Role>> => {
    return apiRequest.get<ApiResponse<Role>>(`/api/v1/roles/${roleKey}`);
  },

  /**
   * Create new role
   */
  createRole: (data: RoleCreateRequest): Promise<ApiResponse<Role>> => {
    return apiRequest.post<ApiResponse<Role>>('/api/v1/roles', data);
  },

  /**
   * Update existing role
   */
  updateRole: (roleKey: string, data: RoleUpdateRequest): Promise<ApiResponse<Role>> => {
    return apiRequest.put<ApiResponse<Role>>(`/api/v1/roles/${roleKey}`, data);
  },

  /**
   * Delete role
   */
  deleteRole: (roleKey: string): Promise<ApiResponse<null>> => {
    return apiRequest.delete<ApiResponse<null>>(`/api/v1/roles/${roleKey}`);
  },

  /**
   * Assign permissions to role
   */
  assignPermissionsToRole: (roleId: number, permissionKeys: string[]): Promise<ApiResponse<null>> => {
    return apiRequest.post<ApiResponse<null>>(`/api/v1/roles/${roleId}/permissions`, permissionKeys);
  },

  /**
   * Update role permissions (replace all)
   */
  updateRolePermissions: (roleId: number, permissionKeys: string[]): Promise<ApiResponse<null>> => {
    return apiRequest.put<ApiResponse<null>>(`/api/v1/roles/${roleId}/permissions`, permissionKeys);
  },

  /**
   * Remove permission from role
   */
  removePermissionFromRole: (roleId: number, permissionKey: string): Promise<ApiResponse<null>> => {
    return apiRequest.delete<ApiResponse<null>>(`/api/v1/roles/${roleId}/permissions/${permissionKey}`);
  },

  /**
   * Permission Management APIs
   */

  /**
   * Get all permissions
   */
  getPermissions: (): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>('/api/v1/permissions');
  },

  /**
   * Get active permissions only
   */
  getActivePermissions: (): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>('/api/v1/permissions/active');
  },

  /**
   * Get system permissions
   */
  getSystemPermissions: (): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>('/api/v1/permissions/system');
  },

  /**
   * Get permissions by category
   */
  getPermissionsByCategory: (category: string): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/permissions/category/${category}`);
  },

  /**
   * Search permissions by keyword
   */
  searchPermissions: (keyword: string): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/permissions/search?keyword=${encodeURIComponent(keyword)}`);
  },

  /**
   * Get permission by key
   */
  getPermissionByKey: (permissionKey: string): Promise<ApiResponse<Permission>> => {
    return apiRequest.get<ApiResponse<Permission>>(`/api/v1/permissions/${permissionKey}`);
  },

  /**
   * Create new permission
   */
  createPermission: (data: PermissionCreateRequest): Promise<ApiResponse<Permission>> => {
    return apiRequest.post<ApiResponse<Permission>>('/api/v1/permissions', data);
  },

  /**
   * Update existing permission
   */
  updatePermission: (permissionKey: string, data: PermissionUpdateRequest): Promise<ApiResponse<Permission>> => {
    return apiRequest.put<ApiResponse<Permission>>(`/api/v1/permissions/${permissionKey}`, data);
  },

  /**
   * Delete permission
   */
  deletePermission: (permissionKey: string): Promise<ApiResponse<null>> => {
    return apiRequest.delete<ApiResponse<null>>(`/api/v1/permissions/${permissionKey}`);
  },

  /**
   * Tenant-specific APIs
   */

  /**
   * Initialize tenant permissions/roles
   */
  initializeTenantPermissions: (tenantKey: string): Promise<ApiResponse<null>> => {
    return apiRequest.post<ApiResponse<null>>(`/api/v1/tenants/${tenantKey}/init-permissions`);
  },

  /**
   * Get tenant roles
   */
  getTenantRoles: (tenantKey: string): Promise<ApiResponse<Role[]>> => {
    return apiRequest.get<ApiResponse<Role[]>>(`/api/v1/tenants/${tenantKey}/roles`);
  },

  /**
   * Get tenant permissions
   */
  getTenantPermissions: (tenantKey: string): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/tenants/${tenantKey}/permissions`);
  },

  /**
   * Evict tenant cache
   */
  evictTenantCache: (tenantKey: string): Promise<void> => {
    return apiRequest.post<void>(`/api/v1/tenants/${tenantKey}/cache/evict`);
  },

  /**
   * Additional utility methods
   */

  /**
   * Get role permissions (detailed)
   */
  getRolePermissions: (roleId: number): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/roles/${roleId}/permissions`);
  },

  /**
   * Check if role has specific permission
   */
  checkRolePermission: (roleId: number, permissionKey: string): Promise<ApiResponse<{ hasPermission: boolean }>> => {
    return apiRequest.get<ApiResponse<{ hasPermission: boolean }>>(`/api/v1/roles/${roleId}/permissions/${permissionKey}`);
  },

  /**
   * Bulk assign permissions to role
   */
  bulkAssignPermissions: (roleId: number, permissionKeys: string[]): Promise<ApiResponse<null>> => {
    return apiRequest.post<ApiResponse<null>>(`/api/v1/roles/${roleId}/permissions/bulk`, { permissionKeys });
  },

  /**
   * Get permissions by resource
   */
  getPermissionsByResource: (resource: string): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/permissions/resource/${resource}`);
  },

  /**
   * Get permissions by action
   */
  getPermissionsByAction: (action: string): Promise<ApiResponse<Permission[]>> => {
    return apiRequest.get<ApiResponse<Permission[]>>(`/api/v1/permissions/action/${action}`);
  },

  /**
   * Clone role with permissions
   */
  cloneRole: (sourceRoleKey: string, newRoleData: {
    roleKey: string;
    roleName: string;
    description?: string;
  }): Promise<ApiResponse<Role>> => {
    return apiRequest.post<ApiResponse<Role>>(`/api/v1/roles/${sourceRoleKey}/clone`, newRoleData);
  },

  /**
   * Export role permissions to JSON
   */
  exportRolePermissions: (roleKey: string): Promise<ApiResponse<{ role: Role; permissions: Permission[] }>> => {
    return apiRequest.get<ApiResponse<{ role: Role; permissions: Permission[] }>>(`/api/v1/roles/${roleKey}/export`);
  },

  /**
   * Import role permissions from JSON
   */
  importRolePermissions: (data: { role: RoleCreateRequest; permissionKeys: string[] }): Promise<ApiResponse<Role>> => {
    return apiRequest.post<ApiResponse<Role>>('/api/v1/roles/import', data);
  },
};
