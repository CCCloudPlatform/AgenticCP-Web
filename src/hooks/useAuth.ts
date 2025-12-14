import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

/**
 * Authentication Hook
 */
export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, register, logout, clearError, checkAuth } = useAuthStore();

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
  };
};

