import { useAuthStore } from '@/store/authStore';
import { useAuthorizationStore } from '@/store/authorizationStore';
import { UserRole } from '@/types';
import { useEffect } from 'react';

/**
 * Authentication Hook (확장)
 * 기존 인증 기능에 권한 검증 기능을 추가한 통합 훅
 */
export const useAuth = () => {
  const authStore = useAuthStore();
  const authorizationStore = useAuthorizationStore();
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError, checkAuth } = authStore;

  // 사용자 로그인 시 권한 정보 자동 로드
  useEffect(() => {
    if (isAuthenticated && user) {
      authorizationStore.fetchUserPermissions();
      authorizationStore.fetchUserRoles();
    }
  }, [isAuthenticated, user]);

  // 기존 역할 검증 (로컬 사용자 정보 기반)
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isSuperAdmin = (): boolean => {
    return user?.role === 'SUPER_ADMIN';
  };

  const isTenantAdmin = (): boolean => {
    return user?.role === 'TENANT_ADMIN' || isSuperAdmin();
  };

  return {
    // 기존 인증 기능
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    checkAuth,
    hasRole,
    isSuperAdmin,
    isTenantAdmin,
    
    // 권한 검증 기능 추가 (서버 기반)
    hasPermission: authorizationStore.hasPermission,
    hasServerRole: authorizationStore.hasRole,
    
    // 권한 상태
    userPermissions: authorizationStore.userPermissions,
    userRoles: authorizationStore.userRoles,
    permissionLoading: authorizationStore.isLoading,
    permissionError: authorizationStore.error,
    
    // 권한 새로고침
    refreshPermissions: authorizationStore.fetchUserPermissions,
    refreshRoles: authorizationStore.fetchUserRoles,
    clearPermissionCache: authorizationStore.clearCache,
  };
};

