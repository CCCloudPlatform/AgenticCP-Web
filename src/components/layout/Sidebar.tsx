import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.scss';

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  children?: MenuItem[];
  disabled?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      key: ROUTES.DASHBOARD,
      icon: '📊',
      label: '대시보드',
    },
    {
      key: ROUTES.PROJECT,
      icon: '📁',
      label: '프로젝트 관리',
      disabled: !hasRole(['SUPER_ADMIN', 'TENANT_ADMIN']),
    },
    {
      key: 'cloud',
      icon: '☁️',
      label: '클라우드 리소스',
      children: [
        {
          key: ROUTES.RESOURCES,
          icon: '📦',
          label: '리소스',
        },
        {
          key: ROUTES.INVENTORY,
          icon: '📋',
          label: '인벤토리',
        },
      ],
    },
    {
      key: 'orchestration',
      icon: '🎯',
      label: '오케스트레이션',
      children: [
        {
          key: ROUTES.DEPLOYMENTS,
          icon: '🚀',
          label: '배포',
        },
        {
          key: ROUTES.SCALING,
          icon: '📈',
          label: '스케일링',
        },
      ],
    },
    {
      key: 'monitoring',
      icon: '📊',
      label: '모니터링',
      children: [
        {
          key: ROUTES.METRICS,
          icon: '📈',
          label: '메트릭',
        },
        {
          key: ROUTES.LOGS,
          icon: '📝',
          label: '로그',
        },
        {
          key: ROUTES.ALERTS,
          icon: '🚨',
          label: '알림',
        },
      ],
    },
    {
      key: 'security',
      icon: '🔒',
      label: '보안 & 컴플라이언스',
      children: [
        {
          key: ROUTES.USERS,
          icon: '👤',
          label: '사용자',
        },
        {
          key: ROUTES.ROLES,
          icon: '🎭',
          label: '역할',
        },
        {
          key: ROUTES.POLICIES,
          icon: '📋',
          label: '정책',
        },
      ],
      disabled: !hasRole(['SUPER_ADMIN', 'TENANT_ADMIN']),
    },
    {
      key: 'cost',
      icon: '💰',
      label: '비용 관리',
      children: [
        {
          key: ROUTES.COST_TRACKING,
          icon: '📊',
          label: '비용 추적',
        },
        {
          key: ROUTES.BUDGETS,
          icon: '💳',
          label: '예산',
        },
        {
          key: ROUTES.OPTIMIZATION,
          icon: '⚡',
          label: '최적화',
        },
      ],
    },
    {
      key: 'iac',
      icon: '🏗️',
      label: 'Infrastructure as Code',
      children: [
        {
          key: ROUTES.TEMPLATES,
          icon: '📄',
          label: '템플릿',
        },
        {
          key: ROUTES.PIPELINES,
          icon: '🔄',
          label: '파이프라인',
        },
      ],
    },
    {
      key: 'integration',
      icon: '🔗',
      label: '통합 & API',
      children: [
        {
          key: ROUTES.API_MANAGEMENT,
          icon: '🔌',
          label: 'API 관리',
        },
        {
          key: ROUTES.WEBHOOKS,
          icon: '🎣',
          label: '웹훅',
        },
      ],
    },
    {
      key: ROUTES.NOTIFICATIONS,
      icon: '🔔',
      label: '알림',
    },
    {
      key: ROUTES.SETTINGS,
      icon: '⚙️',
      label: '설정',
    },
  ];

  const isActive = (key: string) => {
    return location.pathname.startsWith(key);
  };

  const isExpanded = (key: string) => {
    return expandedItems.includes(key);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.key);
    } else {
      navigate(item.key);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.key);
    const expanded = isExpanded(item.key);

    return (
      <div key={item.key} className="nav-item">
        <div
          className={`nav-link ${active ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
          onClick={() => !item.disabled && handleItemClick(item)}
        >
          <span className="nav-icon">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="nav-text">{item.label}</span>
              {hasChildren && <span className={`nav-arrow ${expanded ? 'expanded' : ''}`}>▼</span>}
            </>
          )}
        </div>

        {hasChildren && !collapsed && expanded && (
          <div className="nav-submenu">
            {item.children!.map((child) => (
              <div key={child.key} className="nav-subitem">
                <div
                  className={`nav-sublink ${isActive(child.key) ? 'active' : ''}`}
                  onClick={() => navigate(child.key)}
                >
                  <span className="nav-subicon">{child.icon}</span>
                  <span className="nav-subtext">{child.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`site-sider ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        <h1>{collapsed ? 'AC' : 'AgenticCP'}</h1>
      </div>

      <nav className="nav-menu">{menuItems.map(renderMenuItem)}</nav>

      <div className="sidebar-footer">
        <div className="footer-content">
          <div className="footer-icon">ℹ️</div>
          <div className="footer-text">
            <div className="footer-title">AgenticCP</div>
            <div className="footer-subtitle">Multi-Cloud Platform</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
