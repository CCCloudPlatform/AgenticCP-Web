import React, { useState, useMemo } from 'react';
import { Role, RoleStatus } from '@/types';
import { useRolePermissionStore } from '@/store/rolePermissionStore';
import './RolesList.scss';

interface RolesListProps {
  onRoleSelect: (role: Role | null) => void;
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (role: Role) => void;
}

const RolesList: React.FC<RolesListProps> = ({
  onRoleSelect,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}) => {
  const { roles, selectedRole, isLoading } = useRolePermissionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoleStatus | 'ALL'>('ALL');
  const [systemFilter, setSystemFilter] = useState<'ALL' | 'SYSTEM' | 'CUSTOM'>('ALL');

  // 필터링된 역할 목록
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      // 검색어 필터
      const matchesSearch = 
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.roleKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 상태 필터
      const matchesStatus = statusFilter === 'ALL' || role.status === statusFilter;

      // 시스템 역할 필터
      const matchesSystem = 
        systemFilter === 'ALL' || 
        (systemFilter === 'SYSTEM' && role.isSystem) ||
        (systemFilter === 'CUSTOM' && !role.isSystem);

      return matchesSearch && matchesStatus && matchesSystem;
    });
  }, [roles, searchTerm, statusFilter, systemFilter]);

  const handleRoleClick = (role: Role) => {
    onRoleSelect(role);
  };

  const handleEditClick = (e: React.MouseEvent, role: Role) => {
    e.stopPropagation();
    onEditRole(role);
  };

  const handleDeleteClick = (e: React.MouseEvent, role: Role) => {
    e.stopPropagation();
    onDeleteRole(role);
  };

  const getStatusBadgeClass = (status: RoleStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-badge active';
      case 'INACTIVE':
        return 'status-badge inactive';
      case 'SUSPENDED':
        return 'status-badge suspended';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: RoleStatus) => {
    switch (status) {
      case 'ACTIVE':
        return '활성';
      case 'INACTIVE':
        return '비활성';
      case 'SUSPENDED':
        return '정지';
      default:
        return status;
    }
  };

  return (
    <div className="roles-list">
      {/* 헤더 */}
      <div className="roles-list-header">
        <div className="roles-list-title">
          <h3>역할 관리</h3>
          <button 
            className="btn btn-primary"
            onClick={onCreateRole}
            disabled={isLoading}
          >
            + 역할 생성
          </button>
        </div>

        {/* 검색 및 필터 */}
        <div className="roles-list-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="역할 이름, 키, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RoleStatus | 'ALL')}
              className="filter-select"
            >
              <option value="ALL">전체 상태</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="SUSPENDED">정지</option>
            </select>

            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value as 'ALL' | 'SYSTEM' | 'CUSTOM')}
              className="filter-select"
            >
              <option value="ALL">전체</option>
              <option value="SYSTEM">시스템 역할</option>
              <option value="CUSTOM">사용자 역할</option>
            </select>
          </div>
        </div>
      </div>

      {/* 역할 목록 */}
      <div className="roles-list-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>역할 목록을 불러오는 중...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎭</div>
            <p>검색 조건에 맞는 역할이 없습니다.</p>
          </div>
        ) : (
          <div className="roles-table">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className={`role-item ${selectedRole?.id === role.id ? 'selected' : ''}`}
                onClick={() => handleRoleClick(role)}
              >
                <div className="role-item-header">
                  <div className="role-item-title">
                    <h4 className="role-name">{role.roleName}</h4>
                    <div className="role-badges">
                      {role.isSystem && (
                        <span className="role-badge system">시스템</span>
                      )}
                      {role.isDefault && (
                        <span className="role-badge default">기본</span>
                      )}
                      <span className={getStatusBadgeClass(role.status)}>
                        {getStatusText(role.status)}
                      </span>
                    </div>
                  </div>
                  <div className="role-item-actions">
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={(e) => handleEditClick(e, role)}
                      disabled={isLoading}
                    >
                      수정
                    </button>
                    <button
                      className={`btn btn-sm ${role.isSystem ? 'btn-disabled' : 'btn-danger'}`}
                      onClick={(e) => handleDeleteClick(e, role)}
                      disabled={isLoading || role.isSystem}
                      title={role.isSystem ? '시스템 역할은 삭제할 수 없습니다' : '역할 삭제'}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="role-item-content">
                  <div className="role-key">
                    <span className="label">키:</span>
                    <code className="key-value">{role.roleKey}</code>
                  </div>
                  
                  {role.description && (
                    <div className="role-description">
                      <span className="label">설명:</span>
                      <span className="description-text">{role.description}</span>
                    </div>
                  )}

                  <div className="role-meta">
                    <div className="meta-item">
                      <span className="label">권한 개수:</span>
                      <span className="value">{role.permissions.length}개</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">우선순위:</span>
                      <span className="value">{role.priority}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">생성일:</span>
                      <span className="value">
                        {new Date(role.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesList;
