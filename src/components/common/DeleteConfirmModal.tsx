import React from 'react';
import './DeleteConfirmModal.scss';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isSystemItem?: boolean;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isSystemItem = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isSystemItem) {
      onConfirm();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="delete-confirm-modal-overlay" onClick={handleBackdropClick}>
      <div className="delete-confirm-modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-icon">⚠️</div>
          <div className="modal-content">
            <p className="modal-message">{message}</p>
            {itemName && (
              <div className="item-name">
                <strong>{itemName}</strong>
              </div>
            )}
            {isSystemItem && (
              <div className="system-warning">
                <div className="warning-badge">시스템 항목</div>
                <p className="warning-text">
                  시스템 항목은 삭제할 수 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button 
            className={`btn ${isSystemItem ? 'btn-disabled' : 'btn-danger'}`}
            onClick={handleConfirm}
            disabled={isLoading || isSystemItem}
          >
            {isLoading ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
