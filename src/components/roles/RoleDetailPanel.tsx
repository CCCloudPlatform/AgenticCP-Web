import React, { useState, useEffect } from 'react';
import { Role, Permission } from '@/types';
import { useRolePermissionStore } from '@/store/rolePermissionStore';
import PermissionCheckboxGroup from './PermissionCheckboxGroup';
import './RoleDetailPanel.scss';

interface RoleDetailPanelProps {
  role: Role | null;
}

const RoleDetailPanel: React.FC<RoleDetailPanelProps> = ({ role }) => {
  const { permissions, updateRolePermissions, isLoading } = useRolePermissionStore();
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 역할이 변경될 때마다 선택된 권한 업데이트
  useEffect(() => {
    if (role) {
      const rolePermissionKeys = role.permissions.map(p => p.permissionKey);
      setSelectedPermissionKeys(rolePermissionKeys);
      setHasChanges(false);
    } else {
      setSelectedPermissionKeys([]);
      setHasChanges(false);
    }
  }, [role]);

  // 권한 선택 변경 핸들러
  const handlePermissionChange = (permissionKeys: string[]) => {
    setSelectedPermissionKeys(permissionKeys);
    if (role) {
      const originalKeys = role.permissions.map(p => p.permissionKey);
      const hasChanged = 
        permissionKeys.length !== originalKeys.length ||
        !permissionKeys.every(key => originalKeys.includes(key));
      setHasChanges(hasChanged);
    }
  };

  // 권한 저장
  const handleSavePermissions = async () => {
    if (!role || !hasChanges) return;

    setIsSaving(true);
    try {
      await updateRolePermissions(role.id, selectedPermissionKeys);
      setHasChanges(false);
      // 성공 메시지 표시 (토스트 등)
    } catch (error) {
      console.error('권한 저장 실패:', error);
      // 에러 메시지 표시
    } finally {
      setIsSaving(false);
    }
  };

  // 권한 초기화
  const handleResetPermissions = () => {
    if (role) {
      const originalKeys = role.permissions.map(p => p.permissionKey);
      setSelectedPermissionKeys(originalKeys);
      setHasChanges(false);
    }
  };

  if (!role) {
    return (
      <div className="role-detail-panel">
        <div className="role-detail-empty">
          <div className="empty-icon">🎭</div>
          <h3>역할을 선택하세요</h3>
          <p>좌측 목록에서 역할을 선택하면 상세 정보와 권한을 관리할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-detail-panel">
      {/* 역할 정보 헤더 */}
      <div className="role-detail-header">
        <div className="role-header-info">
          <h3 className="role-title">{role.roleName}</h3>
          <div className="role-badges">
            {role.isSystem && (
              <span className="role-badge system">시스템 역할</span>
            )}
            {role.isDefault && (
              <span className="role-badge default">기본 역할</span>
            )}
            <span className={`status-badge ${role.status.toLowerCase()}`}>
              {role.status === 'ACTIVE' ? '활성' : 
               role.status === 'INACTIVE' ? '비활성' : '정지'}
            </span>
          </div>
        </div>
        
        <div className="role-header-actions">
          {hasChanges && (
            <div className="unsaved-changes">
              <span className="changes-indicator">변경사항 있음</span>
            </div>
          )}
        </div>
      </div>

      {/* 역할 상세 정보 */}
      <div className="role-detail-info">
        <div className="info-section">
          <h4 className="section-title">기본 정보</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">역할 키</span>
              <code className="info-value">{role.roleKey}</code>
            </div>
            <div className="info-item">
              <span className="info-label">우선순위</span>
              <span className="info-value">{role.priority}</span>
            </div>
            <div className="info-item">
              <span className="info-label">생성일</span>
              <span className="info-value">
                {new Date(role.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">생성자</span>
              <span className="info-value">{role.createdBy}</span>
            </div>
          </div>
          
          {role.description && (
            <div className="info-item full-width">
              <span className="info-label">설명</span>
              <p className="info-description">{role.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* 권한 관리 */}
      <div className="role-permissions-section">
        <div className="permissions-header">
          <h4 className="section-title">
            권한 관리 ({selectedPermissionKeys.length}개 선택됨)
          </h4>
          <div className="permissions-actions">
            {hasChanges && (
              <>
                <button 
                  className="btn btn-secondary"
                  onClick={handleResetPermissions}
                  disabled={isSaving}
                >
                  초기화
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSavePermissions}
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="permissions-content">
          <PermissionCheckboxGroup
            permissions={permissions}
            selectedPermissionKeys={selectedPermissionKeys}
            onSelectionChange={handlePermissionChange}
            disabled={isSaving || isLoading}
          />
        </div>
      </div>

      {/* 현재 권한 목록 (읽기 전용) */}
      {role.permissions.length > 0 && (
        <div className="current-permissions-section">
          <h4 className="section-title">현재 권한 목록</h4>
          <div className="permissions-list">
            {role.permissions.map((permission) => (
              <div key={permission.permissionKey} className="permission-item">
                <div className="permission-info">
                  <span className="permission-name">{permission.permissionName}</span>
                  <code className="permission-key">{permission.permissionKey}</code>
                </div>
                <div className="permission-meta">
                  <span className="permission-category">{permission.category}</span>
                  {permission.isSystem && (
                    <span className="permission-badge system">시스템</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleDetailPanel;
