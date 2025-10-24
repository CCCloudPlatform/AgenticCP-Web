import React from 'react';
import { Button, ButtonProps } from 'antd';
import { usePermission } from '@/hooks/usePermission';

interface ProtectedButtonProps extends ButtonProps {
  permission?: string;
  role?: string | string[];
  disabledText?: string; // 권한이 없을 때 표시할 텍스트
  requireAll?: boolean; // true면 모든 권한/역할이 필요, false면 하나라도 있으면 됨
}

/**
 * ProtectedButton
 * 권한 기반 버튼 활성화/비활성화를 위한 래퍼 컴포넌트
 */
const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  permission,
  role,
  disabledText,
  requireAll = false,
  children,
  disabled,
  ...buttonProps
}) => {
  const { hasPermission, hasRole } = usePermission();

  let hasAccess = true;

  // 권한 검증
  if (permission) {
    const hasRequiredPermission = hasPermission(permission);
    if (!hasRequiredPermission) {
      hasAccess = false;
    }
  }

  // 역할 검증
  if (role) {
    const hasRequiredRole = hasRole(role);
    if (!hasRequiredRole) {
      hasAccess = false;
    }
  }

  // 권한과 역할이 모두 필요한 경우
  if (requireAll && permission && role) {
    const hasRequiredPermission = hasPermission(permission);
    const hasRequiredRole = hasRole(role);
    
    if (!hasRequiredPermission || !hasRequiredRole) {
      hasAccess = false;
    }
  }

  // 권한이 없으면 비활성화
  const isDisabled = disabled || !hasAccess;

  return (
    <Button
      {...buttonProps}
      disabled={isDisabled}
      title={isDisabled && disabledText ? disabledText : buttonProps.title}
    >
      {children}
    </Button>
  );
};

export default ProtectedButton;
