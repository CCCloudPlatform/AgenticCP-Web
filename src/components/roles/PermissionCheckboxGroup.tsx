import React, { useState, useMemo } from 'react';
import { Permission } from '@/types';
import './PermissionCheckboxGroup.scss';

interface PermissionCheckboxGroupProps {
  permissions: Permission[];
  selectedPermissionKeys: string[];
  onSelectionChange: (permissionKeys: string[]) => void;
  disabled?: boolean;
}

interface GroupedPermissions {
  [category: string]: Permission[];
}

const PermissionCheckboxGroup: React.FC<PermissionCheckboxGroupProps> = ({
  permissions,
  selectedPermissionKeys,
  onSelectionChange,
  disabled = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // 권한을 카테고리별로 그룹화
  const groupedPermissions = useMemo(() => {
    return permissions.reduce<GroupedPermissions>((groups, permission) => {
      const category = permission.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    }, {});
  }, [permissions]);

  // 카테고리별 선택된 권한 개수 계산
  const getCategorySelectionCount = (category: string) => {
    const categoryPermissions = groupedPermissions[category] || [];
    return categoryPermissions.filter(p => selectedPermissionKeys.includes(p.permissionKey)).length;
  };

  // 카테고리 전체 선택/해제
  const toggleCategorySelection = (category: string) => {
    const categoryPermissions = groupedPermissions[category] || [];
    const categoryPermissionKeys = categoryPermissions.map(p => p.permissionKey);
    const allSelected = categoryPermissionKeys.every(key => selectedPermissionKeys.includes(key));

    if (allSelected) {
      // 전체 해제
      const newSelection = selectedPermissionKeys.filter(key => !categoryPermissionKeys.includes(key));
      onSelectionChange(newSelection);
    } else {
      // 전체 선택
      const newSelection = [...new Set([...selectedPermissionKeys, ...categoryPermissionKeys])];
      onSelectionChange(newSelection);
    }
  };

  // 개별 권한 선택/해제
  const togglePermissionSelection = (permissionKey: string) => {
    if (selectedPermissionKeys.includes(permissionKey)) {
      onSelectionChange(selectedPermissionKeys.filter(key => key !== permissionKey));
    } else {
      onSelectionChange([...selectedPermissionKeys, permissionKey]);
    }
  };

  // 카테고리 펼침/접기
  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // 전체 선택/해제
  const toggleAllSelection = () => {
    const allPermissionKeys = permissions.map(p => p.permissionKey);
    const allSelected = allPermissionKeys.every(key => selectedPermissionKeys.includes(key));

    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allPermissionKeys);
    }
  };

  const allSelected = permissions.length > 0 && permissions.every(p => selectedPermissionKeys.includes(p.permissionKey));
  const someSelected = selectedPermissionKeys.length > 0 && !allSelected;

  return (
    <div className="permission-checkbox-group">
      {/* 전체 선택 헤더 */}
      <div className="permission-group-header">
        <div className="permission-group-title">
          <label className="permission-checkbox-label">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected;
              }}
              onChange={toggleAllSelection}
              disabled={disabled}
              className="permission-checkbox"
            />
            <span className="permission-checkbox-text">
              전체 선택 ({selectedPermissionKeys.length}/{permissions.length})
            </span>
          </label>
        </div>
      </div>

      {/* 카테고리별 권한 목록 */}
      <div className="permission-categories">
        {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
          const isExpanded = expandedCategories.includes(category);
          const categorySelectedCount = getCategorySelectionCount(category);
          const categoryTotalCount = categoryPermissions.length;
          const isCategoryFullySelected = categorySelectedCount === categoryTotalCount;
          const isCategoryPartiallySelected = categorySelectedCount > 0 && !isCategoryFullySelected;

          return (
            <div key={category} className="permission-category">
              {/* 카테고리 헤더 */}
              <div 
                className="permission-category-header"
                onClick={() => toggleCategoryExpansion(category)}
              >
                <div className="permission-category-title">
                  <label className="permission-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isCategoryFullySelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isCategoryPartiallySelected;
                      }}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleCategorySelection(category);
                      }}
                      disabled={disabled}
                      className="permission-checkbox"
                    />
                    <span className="permission-checkbox-text">
                      {category} ({categorySelectedCount}/{categoryTotalCount})
                    </span>
                  </label>
                </div>
                <div className={`permission-category-arrow ${isExpanded ? 'expanded' : ''}`}>
                  ▼
                </div>
              </div>

              {/* 카테고리 권한 목록 */}
              {isExpanded && (
                <div className="permission-category-content">
                  {categoryPermissions.map((permission) => (
                    <div key={permission.permissionKey} className="permission-item">
                      <label className="permission-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedPermissionKeys.includes(permission.permissionKey)}
                          onChange={() => togglePermissionSelection(permission.permissionKey)}
                          disabled={disabled}
                          className="permission-checkbox"
                        />
                        <div className="permission-item-content">
                          <span className="permission-item-name">
                            {permission.permissionName}
                          </span>
                          <span className="permission-item-key">
                            {permission.permissionKey}
                          </span>
                          {permission.description && (
                            <span className="permission-item-description">
                              {permission.description}
                            </span>
                          )}
                          {permission.isSystem && (
                            <span className="permission-item-badge system">
                              시스템
                            </span>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionCheckboxGroup;
