import React from 'react';
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

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

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
        
        <div className="logo">
          <div className="logo-icon">AC</div>
          <span className="logo-text">AgenticCP</span>
        </div>
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

        <div className="user-info" onClick={() => navigate(ROUTES.SETTINGS)}>
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-role">{user?.role || 'USER'}</div>
          </div>
          <span className="dropdown-icon">▼</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

