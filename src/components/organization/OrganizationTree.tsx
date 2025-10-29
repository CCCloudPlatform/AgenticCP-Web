import React, { useState, useMemo } from 'react';
import { OrganizationHierarchyResponse, OrganizationResponse, OrganizationType } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import './OrganizationTree.scss';

interface OrganizationTreeProps {
  onOrganizationSelect: (organization: OrganizationResponse | null) => void;
  onCreateOrganization: (parentId?: number) => void;
  onEditOrganization: (organization: OrganizationResponse) => void;
  onDeleteOrganization: (organization: OrganizationResponse) => void;
  onMoveOrganization: (organization: OrganizationResponse) => void;
}

interface TreeNodeProps {
  node: OrganizationHierarchyResponse;
  level: number;
  onSelect: (organization: OrganizationResponse) => void;
  onCreate: (parentId: number) => void;
  onEdit: (organization: OrganizationResponse) => void;
  onDelete: (organization: OrganizationResponse) => void;
  onMove: (organization: OrganizationResponse) => void;
  selectedId?: number;
  expandedNodes: Set<number>;
  onToggleExpand: (id: number) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  onMove,
  selectedId,
  expandedNodes,
  onToggleExpand,
}) => {
  const { organization, children } = node;
  const isExpanded = expandedNodes.has(organization.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedId === organization.id;

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(organization.id);
    }
  };

  const handleSelect = () => {
    onSelect(organization);
  };

  const handleCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreate(organization.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(organization);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(organization);
  };

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMove(organization);
  };

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

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleSelect}
      >
        {/* 확장/축소 버튼 */}
        <div className="expand-button" onClick={handleToggleExpand}>
          {hasChildren ? (
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▶
            </span>
          ) : (
            <span className="expand-placeholder"></span>
          )}
        </div>

        {/* 조직 아이콘 */}
        <div className="organization-icon">
          {getOrganizationIcon(organization.orgType)}
        </div>

        {/* 조직 정보 */}
        <div className="organization-info">
          <div className="organization-name">
            <span className="name">{organization.orgName}</span>
            <span className={getStatusBadgeClass(organization.status)}>
              {getStatusText(organization.status)}
            </span>
          </div>
          <div className="organization-meta">
            <span className="type">{organization.orgType}</span>
            {organization.description && (
              <span className="description">{organization.description}</span>
            )}
            <span className="members-count">
              구성원 {organization.membersCount}명
            </span>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="organization-actions">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleCreate}
            title="하위 조직 생성"
          >
            +
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={handleEdit}
            title="조직 수정"
          >
            ✏️
          </button>
          <button
            className="btn btn-sm btn-warning"
            onClick={handleMove}
            title="조직 이동"
          >
            📁
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={handleDelete}
            title="조직 삭제"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* 하위 조직들 */}
      {isExpanded && hasChildren && (
        <div className="tree-children">
          {children.map((child) => (
            <TreeNode
              key={child.organization.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onCreate={onCreate}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  onOrganizationSelect,
  onCreateOrganization,
  onEditOrganization,
  onDeleteOrganization,
  onMoveOrganization,
}) => {
  const { organizationTree, selectedOrganization, isLoading } = useOrganizationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<OrganizationType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  // 필터링된 트리 데이터
  const filteredTree = useMemo(() => {
    const filterNode = (node: OrganizationHierarchyResponse): OrganizationHierarchyResponse | null => {
      const { organization, children } = node;
      
      // 검색어 필터
      const matchesSearch = 
        organization.orgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (organization.description && organization.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // 타입 필터
      const matchesType = typeFilter === 'ALL' || organization.orgType === typeFilter;

      // 상태 필터
      const matchesStatus = statusFilter === 'ALL' || organization.status === statusFilter;

      // 현재 노드가 필터에 맞는지 확인
      const currentNodeMatches = matchesSearch && matchesType && matchesStatus;

      // 하위 노드들 필터링
      const filteredChildren = children
        .map(filterNode)
        .filter((child): child is OrganizationHierarchyResponse => child !== null);

      // 현재 노드가 필터에 맞거나 하위 노드 중 하나라도 필터에 맞으면 포함
      if (currentNodeMatches || filteredChildren.length > 0) {
        return {
          organization,
          children: filteredChildren,
        };
      }

      return null;
    };

    return organizationTree
      .map(filterNode)
      .filter((node): node is OrganizationHierarchyResponse => node !== null);
  }, [organizationTree, searchTerm, typeFilter, statusFilter]);

  const handleToggleExpand = (id: number) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCreate = (parentId?: number) => {
    onCreateOrganization(parentId);
  };

  const handleEdit = (organization: OrganizationResponse) => {
    onEditOrganization(organization);
  };

  const handleDelete = (organization: OrganizationResponse) => {
    onDeleteOrganization(organization);
  };

  const handleMove = (organization: OrganizationResponse) => {
    onMoveOrganization(organization);
  };

  const handleSelect = (organization: OrganizationResponse) => {
    onOrganizationSelect(organization);
  };

  const expandAll = () => {
    const allIds = new Set<number>();
    const collectIds = (nodes: OrganizationHierarchyResponse[]) => {
      nodes.forEach(node => {
        allIds.add(node.organization.id);
        if (node.children.length > 0) {
          collectIds(node.children);
        }
      });
    };
    collectIds(organizationTree);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="organization-tree">
      {/* 헤더 */}
      <div className="tree-header">
        <div className="tree-title">
          <h3>조직 구조</h3>
          <div className="tree-controls">
            <button 
              className="btn btn-sm btn-secondary"
              onClick={expandAll}
              disabled={isLoading}
            >
              모두 확장
            </button>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={collapseAll}
              disabled={isLoading}
            >
              모두 축소
            </button>
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => handleCreate()}
              disabled={isLoading}
            >
              + 최상위 조직
            </button>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="tree-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="조직명, 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OrganizationType | 'ALL')}
              className="filter-select"
            >
              <option value="ALL">전체 타입</option>
              <option value="COMPANY">회사</option>
              <option value="DEPARTMENT">부서</option>
              <option value="TEAM">팀</option>
              <option value="GROUP">그룹</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">전체 상태</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              <option value="SUSPENDED">정지</option>
            </select>
          </div>
        </div>
      </div>

      {/* 트리 컨텐츠 */}
      <div className="tree-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>조직 구조를 불러오는 중...</p>
          </div>
        ) : filteredTree.length === 0 ? (
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
                onSelect={handleSelect}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMove={handleMove}
                selectedId={selectedOrganization?.id}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationTree;
