import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import Logo from '@/components/common/Logo';
import './Sidebar.scss';

interface SidebarProps {
  collapsed: boolean;
}

interface MenuItem {
  key: string;
  icon: string;
  label: string;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  requiredPermission?: string;
  requiredRole?: string | string[];
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  const { hasPermission, hasRole: hasServerRole } = usePermission();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // 권한 기반 메뉴 필터링 함수
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      // TODO: API 서버 연결 후 권한 체크 활성화 필요
      // 현재는 API 서버가 연결되지 않아 권한 체크를 임시로 비활성화
      /*
      // 권한 검증
      if (item.requiredPermission) {
        if (!hasPermission(item.requiredPermission)) {
          return false;
        }
      }

      // 역할 검증
      if (item.requiredRole) {
        if (!hasServerRole(item.requiredRole)) {
          return false;
        }
      }
      */

      // 기존 disabled 체크만 유지
      if (item.disabled) {
        return false;
      }

      // 하위 메뉴가 있는 경우 재귀적으로 필터링
      if (item.children) {
        const filteredChildren = filterMenuItems(item.children);
        if (filteredChildren.length === 0) {
          return false; // 하위 메뉴가 모두 필터링되면 부모도 숨김
        }
        item.children = filteredChildren;
      }

      return true;
    });
  };

  const menuItems: MenuItem[] = [
    {
      key: ROUTES.DASHBOARD,
      icon: '📊',
      label: '대시보드',
    },
    {
      key: 'tenants',
      icon: '👥',
      label: '테넌트 관리',
      requiredRole: ['SUPER_ADMIN', 'TENANT_ADMIN'],
    },
    {
      key: ROUTES.ORGANIZATIONS,
      icon: '🏢',
      label: '조직 관리',
      requiredPermission: 'organization.read',
    },
    {
      key: 'cloud',
      icon: '☁️',
      label: '클라우드 리소스',
      requiredPermission: 'cloud.read',
      children: [
        {
          key: ROUTES.PROVIDERS,
          icon: '🏢',
          label: '프로바이더',
          requiredPermission: 'cloud.provider.read',
        },
        {
          key: ROUTES.RESOURCES,
          icon: '📦',
          label: '리소스',
          requiredPermission: 'cloud.resource.read',
        },
        {
          key: ROUTES.INVENTORY,
          icon: '📋',
          label: '인벤토리',
          requiredPermission: 'cloud.inventory.read',
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
      requiredPermission: 'security.read',
      children: [
        {
          key: ROUTES.USERS,
          icon: '👤',
          label: '사용자',
          requiredPermission: 'user.read',
        },
        {
          key: ROUTES.ROLES,
          icon: '🎭',
          label: '역할',
          requiredPermission: 'role.read',
        },
        {
          key: ROUTES.POLICIES,
          icon: '📋',
          label: '정책',
          requiredPermission: 'policy.read',
        },
      ],
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
      key: 'settings',
      icon: '⚙️',
      label: '설정',
      requiredRole: ['SUPER_ADMIN', 'TENANT_ADMIN'],
      children: [
        {
          key: ROUTES.ROLES_PERMISSIONS,
          icon: '🎭',
          label: '역할 및 권한',
          requiredPermission: 'role.read',
        },
        {
          key: '/settings/permission-test',
          icon: '🧪',
          label: '권한 테스트',
          requiredRole: ['SUPER_ADMIN', 'TENANT_ADMIN'],
        },
      ],
    },
  ];

  // 필터링된 메뉴 아이템 사용
  const filteredMenuItems = filterMenuItems(menuItems);

  const isActive = (key: string) => {
    return location.pathname.startsWith(key);
  };

  const isExpanded = (key: string) => {
    return expandedItems.includes(key);
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
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
              {hasChildren && (
                <span className={`nav-arrow ${expanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              )}
            </>
          )}
        </div>
        
        {hasChildren && !collapsed && expanded && (
          <div className="nav-submenu">
            {item.children!.map(child => (
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
        {collapsed ? (
          <Logo 
            variant="square" 
            width={60} 
            height={60} 
            className="sidebar-logo-collapsed"
            alt="AgenticCP Logo"
          />
        ) : (
          <Logo 
            variant="horizontal" 
            width={220} 
            height={55} 
            className="sidebar-logo-expanded"
            alt="AgenticCP Logo"
          />
        )}
      </div>
      
      <nav className="nav-menu">
        {filteredMenuItems.map(renderMenuItem)}
      </nav>

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

