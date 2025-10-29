import React, { useState, useEffect } from 'react';
import { OrganizationMember, User, OrganizationResponse, AddUserToOrganizationRequest } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import { organizationService } from '@/services/organizationService';
import './AddMemberModal.scss';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  organizationId,
}) => {
  const { addMember, members, isLoading } = useOrganizationStore();
  const [memberType, setMemberType] = useState<'USER' | 'ORGANIZATION'>('USER');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [availableOrganizations, setAvailableOrganizations] = useState<OrganizationResponse[]>([]);
  const [selectedItems, setSelectedItems] = useState<(User | OrganizationResponse)[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 기존 구성원 ID들
  const existingMemberIds = React.useMemo(() => {
    return new Set(members.map(member => member.id));
  }, [members]);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setMemberType('USER');
      setSearchTerm('');
      setSelectedItems([]);
      setAvailableUsers([]);
      setAvailableOrganizations([]);
    }
  }, [isOpen]);

  // 사용자 검색
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setAvailableUsers([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: API 서버 연결 후 실제 사용자 검색
      // 현재는 더미 데이터로 대체
      console.warn('API 서버 연결 실패, 더미 사용자 데이터 사용');
      
      const dummyUsers: User[] = [
        {
          id: 10,
          username: 'choi.design',
          email: 'choi.design@agenticcp.com',
          name: '최디자인',
          role: 'DEVELOPER',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 11,
          username: 'jung.qa',
          email: 'jung.qa@agenticcp.com',
          name: '정QA',
          role: 'DEVELOPER',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 12,
          username: 'han.devops',
          email: 'han.devops@agenticcp.com',
          name: '한데브옵스',
          role: 'CLOUD_ADMIN',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
      
      // 검색어로 필터링
      const filteredUsers = dummyUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('사용자 검색 실패:', error);
      setAvailableUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 조직 검색
  const searchOrganizations = async (query: string) => {
    if (!query.trim()) {
      setAvailableOrganizations([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: API 서버 연결 후 실제 조직 검색
      // 현재는 더미 데이터로 대체
      console.warn('API 서버 연결 실패, 더미 조직 데이터 사용');
      
      const dummyOrganizations: OrganizationResponse[] = [
        {
          id: 6,
          orgName: '디자인팀',
          description: 'UI/UX 디자인을 담당하는 팀',
          orgType: 'TEAM',
          parentId: 1,
          depth: 1,
          contactEmail: 'design@agenticcp.com',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin',
          updatedBy: 'admin',
          parentName: 'AgenticCP 본사',
          childrenCount: 0,
          membersCount: 3,
          tenantsCount: 1,
        },
        {
          id: 7,
          orgName: 'QA팀',
          description: '품질 보증을 담당하는 팀',
          orgType: 'TEAM',
          parentId: 1,
          depth: 1,
          contactEmail: 'qa@agenticcp.com',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin',
          updatedBy: 'admin',
          parentName: 'AgenticCP 본사',
          childrenCount: 0,
          membersCount: 4,
          tenantsCount: 1,
        },
      ];
      
      // 검색어로 필터링
      const filteredOrgs = dummyOrganizations.filter(org => 
        org.orgName.toLowerCase().includes(query.toLowerCase()) ||
        (org.description && org.description.toLowerCase().includes(query.toLowerCase()))
      );
      
      setAvailableOrganizations(filteredOrgs);
    } catch (error) {
      console.error('조직 검색 실패:', error);
      setAvailableOrganizations([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (memberType === 'USER') {
        searchUsers(searchTerm);
      } else {
        searchOrganizations(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, memberType]);

  const handleItemSelect = (item: User | OrganizationResponse) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleItemRemove = (itemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) return;

    try {
      for (const item of selectedItems) {
        if (memberType === 'USER') {
          const addData: AddUserToOrganizationRequest = {
            userId: item.id,
            role: 'MEMBER', // 기본 역할
          };
          await addMember(organizationId, addData);
        }
        // 조직을 조직에 추가하는 로직은 별도 API가 필요할 수 있음
      }
      
      onClose();
    } catch (error) {
      console.error('구성원 추가 실패:', error);
    }
  };

  const getItemIcon = (item: User | OrganizationResponse) => {
    if ('username' in item) {
      // User
      return '👤';
    } else {
      // Organization
      switch (item.orgType) {
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
    }
  };

  const getItemName = (item: User | OrganizationResponse) => {
    if ('username' in item) {
      return item.name || item.username;
    } else {
      return item.orgName;
    }
  };

  const getItemSubtitle = (item: User | OrganizationResponse) => {
    if ('username' in item) {
      return item.email;
    } else {
      return item.orgType;
    }
  };

  const currentItems = memberType === 'USER' ? availableUsers : availableOrganizations;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>구성원 추가</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-member-form">
          <div className="form-content">
            {/* 구성원 타입 선택 */}
            <div className="member-type-selection">
              <h3>구성원 타입</h3>
              <div className="type-buttons">
                <button
                  type="button"
                  className={`type-button ${memberType === 'USER' ? 'active' : ''}`}
                  onClick={() => setMemberType('USER')}
                >
                  <span className="type-icon">👤</span>
                  <span>사용자</span>
                </button>
                <button
                  type="button"
                  className={`type-button ${memberType === 'ORGANIZATION' ? 'active' : ''}`}
                  onClick={() => setMemberType('ORGANIZATION')}
                >
                  <span className="type-icon">🏢</span>
                  <span>조직</span>
                </button>
              </div>
            </div>

            {/* 검색 */}
            <div className="search-section">
              <h3>{memberType === 'USER' ? '사용자' : '조직'} 검색</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder={`${memberType === 'USER' ? '사용자명, 이메일' : '조직명'}으로 검색...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* 검색 결과 */}
            <div className="search-results">
              <h3>검색 결과</h3>
              <div className="results-container">
                {isSearching ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>검색 중...</p>
                  </div>
                ) : currentItems.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <p>{searchTerm ? '검색 결과가 없습니다.' : '검색어를 입력하세요.'}</p>
                  </div>
                ) : (
                  <div className="results-list">
                    {currentItems.map((item) => {
                      const isSelected = selectedItems.some(selected => selected.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`result-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleItemSelect(item)}
                        >
                          <div className="item-icon">
                            {getItemIcon(item)}
                          </div>
                          <div className="item-info">
                            <div className="item-name">
                              {getItemName(item)}
                            </div>
                            <div className="item-subtitle">
                              {getItemSubtitle(item)}
                            </div>
                          </div>
                          <div className="item-action">
                            {isSelected ? '✓' : '+'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 항목들 */}
            {selectedItems.length > 0 && (
              <div className="selected-items">
                <h3>선택된 구성원 ({selectedItems.length}명)</h3>
                <div className="selected-list">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="selected-item">
                      <div className="item-icon">
                        {getItemIcon(item)}
                      </div>
                      <div className="item-info">
                        <div className="item-name">
                          {getItemName(item)}
                        </div>
                        <div className="item-subtitle">
                          {getItemSubtitle(item)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => handleItemRemove(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || selectedItems.length === 0}
            >
              {isLoading ? '추가 중...' : `${selectedItems.length}명 추가`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
