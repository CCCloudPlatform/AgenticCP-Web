import React, { useState, useEffect } from 'react';
import { OrganizationResponse } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import OrganizationTree from '@/components/organization/OrganizationTree';
import OrganizationDetailPanel from '@/components/organization/OrganizationDetailPanel';
import OrganizationFormModal from '@/components/organization/OrganizationFormModal';
import MoveOrganizationModal from '@/components/organization/MoveOrganizationModal';
import AddMemberModal from '@/components/organization/AddMemberModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import PageHeader from '@/components/common/PageHeader';
import './OrganizationPage.scss';

const OrganizationPage: React.FC = () => {
  const { 
    organizationTree,
    selectedOrganization,
    isLoading,
    error,
    fetchOrganizationTree,
    selectOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    moveOrganization,
    removeMember,
    clearError
  } = useOrganizationStore();

  // 모달 상태 관리
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // 편집할 조직과 생성할 조직의 상위 조직
  const [organizationToEdit, setOrganizationToEdit] = useState<OrganizationResponse | null>(null);
  const [organizationToDelete, setOrganizationToDelete] = useState<OrganizationResponse | null>(null);
  const [organizationToMove, setOrganizationToMove] = useState<OrganizationResponse | null>(null);
  const [parentOrganizationId, setParentOrganizationId] = useState<number | undefined>(undefined);

  // 페이지 로드 시 조직 트리 가져오기
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchOrganizationTree();
      } catch (error) {
        console.error('조직 데이터 로딩 실패:', error);
      }
    };

    loadData();
  }, [fetchOrganizationTree]);

  // 에러 자동 초기화
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // 조직 생성 핸들러
  const handleCreateOrganization = (parentId?: number) => {
    setOrganizationToEdit(null);
    setParentOrganizationId(parentId);
    setIsFormModalOpen(true);
  };

  // 조직 수정 핸들러
  const handleEditOrganization = (organization: OrganizationResponse) => {
    setOrganizationToEdit(organization);
    setParentOrganizationId(undefined);
    setIsFormModalOpen(true);
  };

  // 조직 삭제 핸들러
  const handleDeleteOrganization = (organization: OrganizationResponse) => {
    setOrganizationToDelete(organization);
    setIsDeleteModalOpen(true);
  };

  // 조직 이동 핸들러
  const handleMoveOrganization = (organization: OrganizationResponse) => {
    setOrganizationToMove(organization);
    setIsMoveModalOpen(true);
  };

  // 구성원 추가 핸들러
  const handleAddMember = (organizationId: number) => {
    setIsMemberModalOpen(true);
  };

  // 구성원 제거 핸들러
  const handleRemoveMember = async (organizationId: number, memberId: number) => {
    try {
      await removeMember(organizationId, memberId);
    } catch (error) {
      console.error('구성원 제거 실패:', error);
    }
  };

  // 조직 삭제 확인
  const handleConfirmDelete = async () => {
    if (!organizationToDelete) return;

    try {
      await deleteOrganization(organizationToDelete.id);
      setIsDeleteModalOpen(false);
      setOrganizationToDelete(null);
      
      // 선택된 조직이 삭제된 경우 선택 해제
      if (selectedOrganization?.id === organizationToDelete.id) {
        selectOrganization(null);
      }
    } catch (error) {
      console.error('조직 삭제 실패:', error);
    }
  };

  // 모달 닫기 핸들러들
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setOrganizationToEdit(null);
    setParentOrganizationId(undefined);
  };

  const handleCloseMoveModal = () => {
    setIsMoveModalOpen(false);
    setOrganizationToMove(null);
  };

  const handleCloseMemberModal = () => {
    setIsMemberModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrganizationToDelete(null);
  };

  return (
    <div className="organization-page">
      <PageHeader
        title="조직 관리"
        subtitle="조직 구조를 관리하고 구성원을 할당할 수 있습니다."
        breadcrumb={[
          { label: '홈', path: '/dashboard' },
          { label: '조직 관리', path: '/organizations' },
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
        <div className="organization-layout">
          {/* 좌측: 조직 트리 */}
          <div className="tree-section">
            <OrganizationTree
              onOrganizationSelect={selectOrganization}
              onCreateOrganization={handleCreateOrganization}
              onEditOrganization={handleEditOrganization}
              onDeleteOrganization={handleDeleteOrganization}
              onMoveOrganization={handleMoveOrganization}
            />
          </div>

          {/* 우측: 조직 상세 패널 */}
          <div className="detail-section">
            <OrganizationDetailPanel
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </div>
        </div>
      </div>

      {/* 조직 생성/수정 모달 */}
      <OrganizationFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        organization={organizationToEdit}
        parentId={parentOrganizationId}
      />

      {/* 조직 이동 모달 */}
      <MoveOrganizationModal
        isOpen={isMoveModalOpen}
        onClose={handleCloseMoveModal}
        organization={organizationToMove}
      />

      {/* 구성원 추가 모달 */}
      <AddMemberModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        organizationId={selectedOrganization?.id || 0}
      />

      {/* 조직 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="조직 삭제"
        message="이 조직을 삭제하시겠습니까? 삭제된 조직은 복구할 수 없습니다."
        itemName={organizationToDelete?.orgName}
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

export default OrganizationPage;
