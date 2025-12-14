import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  MonitorOutlined,
  DollarOutlined,
  DeploymentUnitOutlined,
  CodeOutlined,
  ApiOutlined,
  BellOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.scss';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();

  const menuItems: MenuProps['items'] = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: '대시보드',
      onClick: () => navigate(ROUTES.DASHBOARD),
    },
    {
      key: 'tenants',
      icon: <TeamOutlined />,
      label: '테넌트 관리',
      onClick: () => navigate(ROUTES.TENANTS),
      disabled: !hasRole(['SUPER_ADMIN', 'TENANT_ADMIN']),
    },
    {
      key: 'cloud',
      icon: <CloudOutlined />,
      label: '클라우드 리소스',
      children: [
        {
          key: ROUTES.PROVIDERS,
          label: '프로바이더',
          onClick: () => navigate(ROUTES.PROVIDERS),
        },
        {
          key: ROUTES.RESOURCES,
          label: '리소스',
          onClick: () => navigate(ROUTES.RESOURCES),
        },
        {
          key: ROUTES.INVENTORY,
          label: '인벤토리',
          onClick: () => navigate(ROUTES.INVENTORY),
        },
      ],
    },
    {
      key: 'orchestration',
      icon: <DeploymentUnitOutlined />,
      label: '오케스트레이션',
      children: [
        {
          key: ROUTES.DEPLOYMENTS,
          label: '배포',
          onClick: () => navigate(ROUTES.DEPLOYMENTS),
        },
        {
          key: ROUTES.SCALING,
          label: '스케일링',
          onClick: () => navigate(ROUTES.SCALING),
        },
      ],
    },
    {
      key: 'monitoring',
      icon: <MonitorOutlined />,
      label: '모니터링',
      children: [
        {
          key: ROUTES.METRICS,
          label: '메트릭',
          onClick: () => navigate(ROUTES.METRICS),
        },
        {
          key: ROUTES.LOGS,
          label: '로그',
          onClick: () => navigate(ROUTES.LOGS),
        },
        {
          key: ROUTES.ALERTS,
          label: '알림',
          onClick: () => navigate(ROUTES.ALERTS),
        },
      ],
    },
    {
      key: 'security',
      icon: <SecurityScanOutlined />,
      label: '보안 & 컴플라이언스',
      children: [
        {
          key: ROUTES.USERS,
          label: '사용자',
          onClick: () => navigate(ROUTES.USERS),
        },
        {
          key: ROUTES.ROLES,
          label: '역할',
          onClick: () => navigate(ROUTES.ROLES),
        },
        {
          key: ROUTES.POLICIES,
          label: '정책',
          onClick: () => navigate(ROUTES.POLICIES),
        },
      ],
      disabled: !hasRole(['SUPER_ADMIN', 'TENANT_ADMIN']),
    },
    {
      key: 'cost',
      icon: <DollarOutlined />,
      label: '비용 관리',
      children: [
        {
          key: ROUTES.COST_TRACKING,
          label: '비용 추적',
          onClick: () => navigate(ROUTES.COST_TRACKING),
        },
        {
          key: ROUTES.BUDGETS,
          label: '예산',
          onClick: () => navigate(ROUTES.BUDGETS),
        },
        {
          key: ROUTES.OPTIMIZATION,
          label: '최적화',
          onClick: () => navigate(ROUTES.OPTIMIZATION),
        },
      ],
    },
    {
      key: 'iac',
      icon: <CodeOutlined />,
      label: 'Infrastructure as Code',
      children: [
        {
          key: ROUTES.TEMPLATES,
          label: '템플릿',
          onClick: () => navigate(ROUTES.TEMPLATES),
        },
        {
          key: ROUTES.PIPELINES,
          label: '파이프라인',
          onClick: () => navigate(ROUTES.PIPELINES),
        },
      ],
    },
    {
      key: 'integration',
      icon: <ApiOutlined />,
      label: '통합 & API',
      children: [
        {
          key: ROUTES.API_MANAGEMENT,
          label: 'API 관리',
          onClick: () => navigate(ROUTES.API_MANAGEMENT),
        },
        {
          key: ROUTES.WEBHOOKS,
          label: '웹훅',
          onClick: () => navigate(ROUTES.WEBHOOKS),
        },
      ],
    },
    {
      key: ROUTES.NOTIFICATIONS,
      icon: <BellOutlined />,
      label: '알림',
      onClick: () => navigate(ROUTES.NOTIFICATIONS),
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: '설정',
      onClick: () => navigate(ROUTES.SETTINGS),
    },
  ];

  // Get current selected key from location
  const getSelectedKey = () => {
    const path = location.pathname;
    for (const item of menuItems) {
      if (item && 'key' in item && path.startsWith(item.key as string)) {
        return [item.key as string];
      }
      if (item && 'children' in item) {
        const child = item.children?.find(
          (c) => c && 'key' in c && path.startsWith(c.key as string)
        );
        if (child && 'key' in child) {
          return [child.key as string];
        }
      }
    }
    return [ROUTES.DASHBOARD];
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="site-sider"
      width={250}
    >
      <div className="logo">
        <h1>{collapsed ? 'AC' : 'AgenticCP'}</h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;

