import { useAuthorizationStore } from '@/store/authorizationStore';

/**
 * usePermission Hook
 * UI 컴포넌트에서 권한 검증을 위한 커스텀 훅
 */
export const usePermission = () => {
  const { 
    hasPermission, 
    hasRole, 
    fetchUserPermissions, 
    fetchUserRoles,
    isLoading,
    error 
  } = useAuthorizationStore();
  
  return {
    // 기본 권한/역할 검증
    hasPermission,
    hasRole,
    
    // 리소스별 권한 검증 헬퍼
    canRead: (resource: string) => hasPermission(`${resource}.read`),
    canWrite: (resource: string) => hasPermission(`${resource}.write`),
    canDelete: (resource: string) => hasPermission(`${resource}.delete`),
    canCreate: (resource: string) => hasPermission(`${resource}.create`),
    canUpdate: (resource: string) => hasPermission(`${resource}.update`),
    
    // 특정 액션 권한 검증
    canAccess: (permissionKey: string) => hasPermission(permissionKey),
    
    // 권한 목록 새로고침
    refreshPermissions: () => fetchUserPermissions(),
    refreshRoles: () => fetchUserRoles(),
    
    // 상태
    isLoading,
    error,
  };
};
