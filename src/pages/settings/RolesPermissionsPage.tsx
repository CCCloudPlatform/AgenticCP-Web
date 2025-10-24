import React, { useState, useEffect } from 'react';
import { Role } from '@/types';
import { useRolePermissionStore } from '@/store/rolePermissionStore';
import RolesList from '@/components/roles/RolesList';
import RoleDetailPanel from '@/components/roles/RoleDetailPanel';
import RoleFormModal from '@/components/roles/RoleFormModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import PageHeader from '@/components/common/PageHeader';
import './RolesPermissionsPage.scss';

const RolesPermissionsPage: React.FC = () => {
  const { 
    roles, 
    permissions, 
    selectedRole, 
    isLoading, 
    error,
    fetchRoles, 
    fetchPermissions, 
    selectRole, 
    deleteRole,
    clearError 
  } = useRolePermissionStore();

  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchRoles(),
          fetchPermissions(),
        ]);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    loadData();
  }, [fetchRoles, fetchPermissions]);

  // 역할 생성 핸들러
  const handleCreateRole = () => {
    setRoleToEdit(null);
    setIsRoleFormOpen(true);
  };

  // 역할 수정 핸들러
  const handleEditRole = (role: Role) => {
    setRoleToEdit(role);
    setIsRoleFormOpen(true);
  };

  // 역할 삭제 핸들러
  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  // 역할 삭제 확인
  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete.roleKey);
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
      
      // 선택된 역할이 삭제된 경우 선택 해제
      if (selectedRole?.id === roleToDelete.id) {
        selectRole(null);
      }
    } catch (error) {
      console.error('역할 삭제 실패:', error);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseRoleForm = () => {
    setIsRoleFormOpen(false);
    setRoleToEdit(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  // 에러 초기화
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimer(timer);
    }
  }, [error, clearError]);

  return (
    <div className="roles-permissions-page">
      <PageHeader
        title="역할 및 권한 관리"
        subtitle="시스템의 역할과 권한을 관리하고 사용자에게 할당할 수 있습니다."
        breadcrumb={[
          { label: '설정', path: '/settings' },
          { label: '역할 및 권한 관리', path: '/settings/roles-permissions' },
        ]}
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close"
              onClick={clearError}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="page-content">
        <div className="roles-permissions-layout">
          {/* 좌측: 역할 목록 */}
          <div className="roles-section">
            <RolesList
              onRoleSelect={selectRole}
              onCreateRole={handleCreateRole}
              onEditRole={handleEditRole}
              onDeleteRole={handleDeleteRole}
            />
          </div>

          {/* 우측: 역할 상세 및 권한 관리 */}
          <div className="permissions-section">
            <RoleDetailPanel role={selectedRole} />
          </div>
        </div>
      </div>

      {/* 역할 생성/수정 모달 */}
      <RoleFormModal
        isOpen={isRoleFormOpen}
        onClose={handleCloseRoleForm}
        role={roleToEdit}
      />

      {/* 역할 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="역할 삭제"
        message="이 역할을 삭제하시겠습니까? 삭제된 역할은 복구할 수 없습니다."
        itemName={roleToDelete?.roleName}
        isSystemItem={roleToDelete?.isSystem}
        isLoading={isLoading}
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>처리 중...</p>
        </div>
      )}
    </div>
  );
};

export default RolesPermissionsPage;
