import React from 'react';
import { usePermission } from '@/hooks/usePermission';

interface ProtectedComponentProps {
  permission?: string;
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean; // true면 모든 권한/역할이 필요, false면 하나라도 있으면 됨
}

/**
 * ProtectedComponent
 * 권한 기반 컴포넌트 렌더링을 위한 래퍼 컴포넌트
 */
const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  permission,
  role,
  fallback = null,
  children,
  requireAll = false,
}) => {
  const { hasPermission, hasRole } = usePermission();

  // 권한 검증
  if (permission) {
    const hasRequiredPermission = hasPermission(permission);
    if (!hasRequiredPermission) {
      return <>{fallback}</>;
    }
  }

  // 역할 검증
  if (role) {
    const hasRequiredRole = hasRole(role);
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // 권한과 역할이 모두 필요한 경우
  if (requireAll && permission && role) {
    const hasRequiredPermission = hasPermission(permission);
    const hasRequiredRole = hasRole(role);
    
    if (!hasRequiredPermission || !hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default ProtectedComponent;
