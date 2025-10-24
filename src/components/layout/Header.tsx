import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAgentChatStore } from '@/store/agentChatStore';
import './Header.scss';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen: isAgentChatOpen, toggleChat } = useAgentChatStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleUserInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    navigate(ROUTES.SETTINGS);
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header-left">
        <button
          className="trigger"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? '☰' : '✕'}
        </button>
      </div>

      <div className="header-center">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="검색..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        <button
          className={`notification-btn ${isAgentChatOpen ? 'active' : ''}`}
          onClick={toggleChat}
          aria-label="AI Agent Chat"
        >
          <span>🤖</span>
          <div className="notification-badge"></div>
        </button>

        <button className="notification-btn" aria-label="Notifications">
          <span>🔔</span>
          <div className="notification-badge"></div>
        </button>

        <div className="user-info-container" ref={dropdownRef}>
          <div className="user-info" onClick={handleUserInfoClick}>
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role">{user?.role || 'USER'}</div>
            </div>
            <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-item" onClick={handleSettingsClick}>
                <span className="dropdown-icon">👤</span>
                프로필
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <span className="dropdown-icon">🚪</span>
                로그아웃
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

