import React, { useState, useEffect } from 'react';
import { OrganizationResponse, MoveOrganizationRequest } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import './MoveOrganizationModal.scss';

interface MoveOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: OrganizationResponse | null;
}

interface TreeNodeProps {
  node: any;
  level: number;
  onSelect: (org: OrganizationResponse) => void;
  selectedId?: number;
  disabledIds: Set<number>;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onSelect,
  selectedId,
  disabledIds,
}) => {
  const { organization, children } = node;
  const isSelected = selectedId === organization.id;
  const isDisabled = disabledIds.has(organization.id);

  const handleClick = () => {
    if (!isDisabled) {
      onSelect(organization);
    }
  };

  const getOrganizationIcon = (type: string) => {
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

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        <div className="organization-icon">
          {getOrganizationIcon(organization.orgType)}
        </div>
        <div className="organization-info">
          <div className="organization-name">
            <span className="name">{organization.orgName}</span>
            <span className="type">{organization.orgType}</span>
          </div>
          {organization.description && (
            <div className="organization-description">
              {organization.description}
            </div>
          )}
        </div>
        {isDisabled && (
          <div className="disabled-indicator">
            <span>이동 불가</span>
          </div>
        )}
      </div>

      {children.length > 0 && (
        <div className="tree-children">
          {children.map((child: any) => (
            <TreeNode
              key={child.organization.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              disabledIds={disabledIds}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MoveOrganizationModal: React.FC<MoveOrganizationModalProps> = ({
  isOpen,
  onClose,
  organization,
}) => {
  const { organizationTree, moveOrganization, isLoading } = useOrganizationStore();
  const [selectedParent, setSelectedParent] = useState<OrganizationResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  // 이동 불가능한 조직 ID들 (자기 자신, 하위 조직들)
  const disabledIds = React.useMemo(() => {
    if (!organization) return new Set<number>();
    
    const disabled = new Set<number>();
    disabled.add(organization.id); // 자기 자신
    
    // 하위 조직들도 이동 불가능하도록 설정
    const collectDescendants = (nodes: any[]) => {
      nodes.forEach(node => {
        if (node.organization.id === organization.id) {
          // 현재 조직의 하위 조직들을 모두 수집
          const collectChildren = (children: any[]) => {
            children.forEach(child => {
              disabled.add(child.organization.id);
              collectChildren(child.children);
            });
          };
          collectChildren(node.children);
        } else {
          collectDescendants(node.children);
        }
      });
    };
    
    collectDescendants(organizationTree);
    return disabled;
  }, [organization, organizationTree]);

  // 필터링된 트리 데이터
  const filteredTree = React.useMemo(() => {
    const filterNode = (node: any): any | null => {
      const { organization, children } = node;
      
      const matchesSearch = 
        organization.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (organization.description && organization.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const filteredChildren = children
        .map(filterNode)
        .filter((child: any) => child !== null);

      if (matchesSearch || filteredChildren.length > 0) {
        return {
          organization,
          children: filteredChildren,
        };
      }

      return null;
    };

    return organizationTree
      .map(filterNode)
      .filter((node: any) => node !== null);
  }, [organizationTree, searchTerm]);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedParent(null);
      setSearchTerm('');
      setExpandedNodes(new Set());
    }
  }, [isOpen]);

  const handleParentSelect = (org: OrganizationResponse) => {
    setSelectedParent(org);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organization) return;

    try {
      const moveData: MoveOrganizationRequest = {
        newParentId: selectedParent?.id,
      };
      
      await moveOrganization(organization.id, moveData);
      onClose();
    } catch (error) {
      console.error('조직 이동 실패:', error);
    }
  };

  const getMoveDescription = () => {
    if (!organization) return '';
    
    if (selectedParent) {
      return `${organization.orgName}을(를) ${selectedParent.orgName} 하위로 이동합니다.`;
    } else {
      return `${organization.orgName}을(를) 최상위 조직으로 이동합니다.`;
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>조직 이동</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* 이동할 조직 정보 */}
          <div className="move-info">
            <div className="current-organization">
              <h3>이동할 조직</h3>
              <div className="organization-card">
                <div className="organization-icon">
                  {organization.orgType === 'COMPANY' ? '🏢' : 
                   organization.orgType === 'DEPARTMENT' ? '🏛️' :
                   organization.orgType === 'TEAM' ? '👥' : '🔗'}
                </div>
                <div className="organization-details">
                  <div className="organization-name">{organization.orgName}</div>
                  <div className="organization-type">{organization.orgType}</div>
                </div>
              </div>
            </div>

            <div className="move-description">
              <span className="description-icon">📁</span>
              <span>{getMoveDescription()}</span>
            </div>
          </div>

          {/* 대상 조직 선택 */}
          <div className="target-selection">
            <h3>대상 조직 선택</h3>
            
            <div className="search-box">
              <input
                type="text"
                placeholder="조직명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="tree-container">
              {filteredTree.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <p>검색 조건에 맞는 조직이 없습니다.</p>
                </div>
              ) : (
                <div className="tree-nodes">
                  {filteredTree.map((node) => (
                    <TreeNode
                      key={node.organization.id}
                      node={node}
                      level={0}
                      onSelect={handleParentSelect}
                      selectedId={selectedParent?.id}
                      disabledIds={disabledIds}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 최상위로 이동 옵션 */}
            <div className="root-option">
              <button
                className={`root-button ${!selectedParent ? 'selected' : ''}`}
                onClick={() => setSelectedParent(null)}
              >
                <span className="root-icon">🏠</span>
                <span>최상위 조직으로 이동</span>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '이동 중...' : '이동'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveOrganizationModal;
