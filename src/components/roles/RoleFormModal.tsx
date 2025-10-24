import React, { useState, useEffect } from 'react';
import { Role, RoleCreateRequest, RoleUpdateRequest } from '@/types';
import { useRolePermissionStore } from '@/store/rolePermissionStore';
import PermissionCheckboxGroup from './PermissionCheckboxGroup';
import './RoleFormModal.scss';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null; // 수정 모드일 때 전달
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const { permissions, createRole, updateRole, isLoading } = useRolePermissionStore();
  const [formData, setFormData] = useState({
    roleKey: '',
    roleName: '',
    description: '',
    priority: 50,
  });
  const [selectedPermissionKeys, setSelectedPermissionKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!role;

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && role) {
        setFormData({
          roleKey: role.roleKey,
          roleName: role.roleName,
          description: role.description || '',
          priority: role.priority,
        });
        setSelectedPermissionKeys(role.permissions.map(p => p.permissionKey));
      } else {
        setFormData({
          roleKey: '',
          roleName: '',
          description: '',
          priority: 50,
        });
        setSelectedPermissionKeys([]);
      }
      setErrors({});
    }
  }, [isOpen, isEditMode, role]);

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 권한 선택 변경 핸들러
  const handlePermissionChange = (permissionKeys: string[]) => {
    setSelectedPermissionKeys(permissionKeys);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.roleKey.trim()) {
      newErrors.roleKey = '역할 키를 입력해주세요.';
    } else if (formData.roleKey.length < 2) {
      newErrors.roleKey = '역할 키는 2자 이상이어야 합니다.';
    } else if (!/^[A-Z_]+$/.test(formData.roleKey)) {
      newErrors.roleKey = '역할 키는 대문자와 언더스코어만 사용할 수 있습니다.';
    }

    if (!formData.roleName.trim()) {
      newErrors.roleName = '역할 이름을 입력해주세요.';
    } else if (formData.roleName.length < 2) {
      newErrors.roleName = '역할 이름은 2자 이상이어야 합니다.';
    }

    if (formData.priority < 0 || formData.priority > 1000) {
      newErrors.priority = '우선순위는 0-1000 사이의 값이어야 합니다.';
    }

    if (selectedPermissionKeys.length === 0) {
      newErrors.permissions = '최소 하나의 권한을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && role) {
        const updateData: RoleUpdateRequest = {
          roleName: formData.roleName,
          description: formData.description,
          priority: formData.priority,
          permissionKeys: selectedPermissionKeys,
        };
        await updateRole(role.roleKey, updateData);
      } else {
        const createData: RoleCreateRequest = {
          roleKey: formData.roleKey,
          roleName: formData.roleName,
          description: formData.description,
          priority: formData.priority,
          permissionKeys: selectedPermissionKeys,
          isSystem: false,
        };
        await createRole(createData);
      }
      
      onClose();
    } catch (error) {
      console.error('역할 저장 실패:', error);
      // 에러 메시지 표시
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 닫기
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // 백드롭 클릭 핸들러
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="role-form-modal-overlay" onClick={handleBackdropClick}>
      <div className="role-form-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditMode ? '역할 수정' : '역할 생성'}
          </h3>
          <button 
            className="modal-close-btn" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {/* 기본 정보 섹션 */}
            <div className="form-section">
              <h4 className="section-title">기본 정보</h4>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    역할 키 *
                    {!isEditMode && (
                      <span className="label-hint">(수정 불가)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.roleKey}
                    onChange={(e) => handleInputChange('roleKey', e.target.value.toUpperCase())}
                    disabled={isEditMode || isSubmitting}
                    className={`form-input ${errors.roleKey ? 'error' : ''}`}
                    placeholder="예: MARKETING_MANAGER"
                  />
                  {errors.roleKey && (
                    <span className="form-error">{errors.roleKey}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">역할 이름 *</label>
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={(e) => handleInputChange('roleName', e.target.value)}
                    disabled={isSubmitting}
                    className={`form-input ${errors.roleName ? 'error' : ''}`}
                    placeholder="예: 마케팅팀장"
                  />
                  {errors.roleName && (
                    <span className="form-error">{errors.roleName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">우선순위</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    disabled={isSubmitting}
                    className={`form-input ${errors.priority ? 'error' : ''}`}
                  />
                  {errors.priority && (
                    <span className="form-error">{errors.priority}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={isSubmitting}
                  className="form-textarea"
                  placeholder="역할에 대한 설명을 입력하세요..."
                  rows={3}
                />
              </div>
            </div>

            {/* 권한 선택 섹션 */}
            <div className="form-section">
              <h4 className="section-title">
                권한 선택 *
                {errors.permissions && (
                  <span className="section-error">{errors.permissions}</span>
                )}
              </h4>
              
              <div className="permissions-container">
                <PermissionCheckboxGroup
                  permissions={permissions}
                  selectedPermissionKeys={selectedPermissionKeys}
                  onSelectionChange={handlePermissionChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? '저장 중...' : (isEditMode ? '수정' : '생성')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
