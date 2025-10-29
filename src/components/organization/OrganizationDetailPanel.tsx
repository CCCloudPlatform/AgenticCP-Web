import React, { useState } from 'react';
import { OrganizationResponse, OrganizationMember, OrganizationType } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import './OrganizationDetailPanel.scss';

interface OrganizationDetailPanelProps {
  onAddMember: (organizationId: number) => void;
  onRemoveMember: (organizationId: number, memberId: number) => void;
}

const OrganizationDetailPanel: React.FC<OrganizationDetailPanelProps> = ({
  onAddMember,
  onRemoveMember,
}) => {
  const { selectedOrganization, members, isLoading } = useOrganizationStore();
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'stats'>('info');

  const getOrganizationIcon = (type: OrganizationType) => {
    switch (type) {
      case 'COMPANY':
        return '🏢';
      case 'DEPARTMENT':
        return '🏛️';
      case 'TEAM':
        return '👥';
      case 'GROUP':
        return '🔗';
      default:
        return '📁';
    }
  };

  const getStatusBadgeClass = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getMemberTypeIcon = (type: string) => {
    return type === 'USER' ? '👤' : '🏢';
  };

  const getMemberTypeText = (type: string) => {
    return type === 'USER' ? '사용자' : '조직';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!selectedOrganization) {
    return (
      <div className="organization-detail-panel">
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>조직을 선택하세요</h3>
          <p>좌측에서 조직을 선택하면 상세 정보를 확인할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-detail-panel">
      {/* 헤더 */}
      <div className="panel-header">
        <div className="organization-title">
          <div className="organization-icon">
            {getOrganizationIcon(selectedOrganization.orgType)}
          </div>
          <div className="organization-info">
            <h2>{selectedOrganization.orgName}</h2>
            <div className="organization-badges">
              <span className="type-badge">{selectedOrganization.orgType}</span>
              <span className={getStatusBadgeClass(selectedOrganization.status)}>
                {getStatusText(selectedOrganization.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="panel-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          정보
        </button>
        <button
          className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          구성원 ({members.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          통계
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="panel-content">
        {activeTab === 'info' && (
          <div className="info-tab">
            <div className="info-section">
              <h4>기본 정보</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>조직명</label>
                  <span>{selectedOrganization.orgName}</span>
                </div>
                <div className="info-item">
                  <label>타입</label>
                  <span>{selectedOrganization.orgType}</span>
                </div>
                <div className="info-item">
                  <label>상태</label>
                  <span className={getStatusBadgeClass(selectedOrganization.status)}>
                    {getStatusText(selectedOrganization.status)}
                  </span>
                </div>
                <div className="info-item">
                  <label>깊이</label>
                  <span>Level {selectedOrganization.depth}</span>
                </div>
                {selectedOrganization.parentName && (
                  <div className="info-item">
                    <label>상위 조직</label>
                    <span>{selectedOrganization.parentName}</span>
                  </div>
                )}
              </div>
            </div>

            {selectedOrganization.description && (
              <div className="info-section">
                <h4>설명</h4>
                <p className="description">{selectedOrganization.description}</p>
              </div>
            )}

            {(selectedOrganization.contactEmail || selectedOrganization.contactPhone || selectedOrganization.address) && (
              <div className="info-section">
                <h4>연락처 정보</h4>
                <div className="info-grid">
                  {selectedOrganization.contactEmail && (
                    <div className="info-item">
                      <label>이메일</label>
                      <span>{selectedOrganization.contactEmail}</span>
                    </div>
                  )}
                  {selectedOrganization.contactPhone && (
                    <div className="info-item">
                      <label>전화번호</label>
                      <span>{selectedOrganization.contactPhone}</span>
                    </div>
                  )}
                  {selectedOrganization.address && (
                    <div className="info-item">
                      <label>주소</label>
                      <span>{selectedOrganization.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="info-section">
              <h4>생성 정보</h4>
              <div className="info-grid">
                <div className="info-item">
                  <label>생성일</label>
                  <span>{formatDate(selectedOrganization.createdAt)}</span>
                </div>
                <div className="info-item">
                  <label>생성자</label>
                  <span>{selectedOrganization.createdBy}</span>
                </div>
                <div className="info-item">
                  <label>수정일</label>
                  <span>{formatDate(selectedOrganization.updatedAt)}</span>
                </div>
                <div className="info-item">
                  <label>수정자</label>
                  <span>{selectedOrganization.updatedBy}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h4>구성원 목록</h4>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onAddMember(selectedOrganization.id)}
                disabled={isLoading}
              >
                + 구성원 추가
              </button>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>구성원 목록을 불러오는 중...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>구성원이 없습니다.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => onAddMember(selectedOrganization.id)}
                >
                  구성원 추가하기
                </button>
              </div>
            ) : (
              <div className="members-list">
                {members.map((member) => (
                  <div key={member.id} className="member-item">
                    <div className="member-info">
                      <div className="member-icon">
                        {member.type === 'USER' ? member.name.charAt(0) : getMemberTypeIcon(member.type)}
                      </div>
                      <div className="member-details">
                        <div className="member-name">
                          <span className="name">{member.name}</span>
                          <span className="type-badge">
                            {getMemberTypeText(member.type)}
                          </span>
                        </div>
                        <div className="member-meta">
                          {member.email && (
                            <span className="email">{member.email}</span>
                          )}
                          <div className="role-and-date">
                            {member.role && (
                              <span className="role">{member.role}</span>
                            )}
                            <span className="joined-date">
                              가입일: {formatDate(member.joinedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="member-actions">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveMember(selectedOrganization.id, member.id)}
                        disabled={isLoading}
                        title="구성원 제거"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <div className="stat-value">{selectedOrganization.childrenCount}</div>
                  <div className="stat-label">하위 조직</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{selectedOrganization.membersCount}</div>
                  <div className="stat-label">구성원</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <div className="stat-value">{selectedOrganization.tenantsCount}</div>
                  <div className="stat-label">테넌트</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <div className="stat-value">{selectedOrganization.depth}</div>
                  <div className="stat-label">계층 레벨</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDetailPanel;
