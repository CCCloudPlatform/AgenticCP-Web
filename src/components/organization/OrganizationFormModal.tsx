import React, { useState, useEffect } from 'react';
import { OrganizationResponse, CreateOrganizationRequest, UpdateOrganizationRequest, OrganizationType } from '@/types';
import { useOrganizationStore } from '@/store/organizationStore';
import './OrganizationFormModal.scss';

interface OrganizationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization?: OrganizationResponse | null;
  parentId?: number;
}

const OrganizationFormModal: React.FC<OrganizationFormModalProps> = ({
  isOpen,
  onClose,
  organization,
  parentId,
}) => {
  const { createOrganization, updateOrganization, isLoading } = useOrganizationStore();
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    orgName: '',
    description: '',
    orgType: 'DEPARTMENT',
    parentId: undefined,
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (organization) {
        // 수정 모드
        setFormData({
          orgName: organization.orgName,
          description: organization.description || '',
          orgType: organization.orgType,
          parentId: organization.parentId,
          contactEmail: organization.contactEmail || '',
          contactPhone: organization.contactPhone || '',
          address: organization.address || '',
        });
      } else {
        // 생성 모드
        setFormData({
          orgName: '',
          description: '',
          orgType: 'DEPARTMENT',
          parentId: parentId,
          contactEmail: '',
          contactPhone: '',
          address: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, organization, parentId]);

  const handleInputChange = (field: keyof CreateOrganizationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orgName.trim()) {
      newErrors.orgName = '조직명을 입력해주세요.';
    } else if (formData.orgName.trim().length < 2) {
      newErrors.orgName = '조직명은 2자 이상이어야 합니다.';
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = '올바른 이메일 형식을 입력해주세요.';
    }

    if (formData.contactPhone && !/^[\d\-\+\(\)\s]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = '올바른 전화번호 형식을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (organization) {
        // 수정
        const updateData: UpdateOrganizationRequest = {
          orgName: formData.orgName,
          description: formData.description,
          orgType: formData.orgType,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          address: formData.address,
        };
        await updateOrganization(organization.id, updateData);
      } else {
        // 생성
        await createOrganization(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('조직 저장 실패:', error);
    }
  };

  const getOrganizationTypeLabel = (type: OrganizationType) => {
    switch (type) {
      case 'COMPANY':
        return '회사';
      case 'DEPARTMENT':
        return '부서';
      case 'TEAM':
        return '팀';
      case 'GROUP':
        return '그룹';
      default:
        return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{organization ? '조직 수정' : '조직 생성'}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="organization-form">
          <div className="form-content">
            {/* 기본 정보 */}
            <div className="form-section">
              <h3>기본 정보</h3>
              
              <div className="form-group">
                <label htmlFor="orgName">
                  조직명 <span className="required">*</span>
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => handleInputChange('orgName', e.target.value)}
                  className={`form-input ${errors.orgName ? 'error' : ''}`}
                  placeholder="조직명을 입력하세요"
                  disabled={isLoading}
                />
                {errors.orgName && (
                  <span className="error-message">{errors.orgName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="orgType">조직 타입</label>
                <select
                  id="orgType"
                  value={formData.orgType}
                  onChange={(e) => handleInputChange('orgType', e.target.value as OrganizationType)}
                  className="form-select"
                  disabled={isLoading}
                >
                  <option value="COMPANY">회사</option>
                  <option value="DEPARTMENT">부서</option>
                  <option value="TEAM">팀</option>
                  <option value="GROUP">그룹</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">설명</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  placeholder="조직에 대한 설명을 입력하세요"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="form-section">
              <h3>연락처 정보</h3>
              
              <div className="form-group">
                <label htmlFor="contactEmail">이메일</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className={`form-input ${errors.contactEmail ? 'error' : ''}`}
                  placeholder="contact@example.com"
                  disabled={isLoading}
                />
                {errors.contactEmail && (
                  <span className="error-message">{errors.contactEmail}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">전화번호</label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className={`form-input ${errors.contactPhone ? 'error' : ''}`}
                  placeholder="010-1234-5678"
                  disabled={isLoading}
                />
                {errors.contactPhone && (
                  <span className="error-message">{errors.contactPhone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">주소</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="form-input"
                  placeholder="서울시 강남구 테헤란로 123"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 상위 조직 정보 */}
            {parentId && (
              <div className="form-section">
                <h3>상위 조직</h3>
                <div className="info-box">
                  <span className="info-icon">ℹ️</span>
                  <span>이 조직은 선택된 상위 조직의 하위 조직으로 생성됩니다.</span>
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
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : (organization ? '수정' : '생성')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationFormModal;
