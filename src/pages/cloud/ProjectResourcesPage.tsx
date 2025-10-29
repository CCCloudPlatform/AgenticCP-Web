import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Typography, Tag, Badge, Dropdown, Avatar, Tabs } from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '@/services/projectService';
import { Project, Resource } from '@/types';
import './ProjectResourcesPage.scss';

const { Title, Text } = Typography;

// 리소스 타입 분류 함수
const getResourceCategory = (resourceType: string): 'server' | 'storage' | 'network' | 'other' => {
  const type = resourceType.toLowerCase();

  // 서버 리소스
  if (['ec2', 'compute engine', 'virtual machine', 'vm', 'compute'].includes(type)) {
    return 'server';
  }

  // 스토리지 리소스 (오브젝트 스토리지만 포함, 데이터베이스 제외)
  if (['s3', 'cloud storage', 'blob storage'].includes(type)) {
    return 'storage';
  }

  // 네트워크 리소스
  if (['vpc', 'virtual network', 'vnet', 'network'].includes(type)) {
    return 'network';
  }

  return 'other';
};

const ProjectResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchProjectResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjectResources = async () => {
    try {
      setLoading(true);
      const projectId = searchParams.get('projectId');
      if (projectId) {
        const projectData = await projectService.getProjectById(Number(projectId));
        setProject(projectData);
      }
    } catch (error) {
      console.error('프로젝트 리소스 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (providerName: string) => {
    switch (providerName.toLowerCase()) {
      case 'aws':
        return '🟠';
      case 'gcp':
        return '🔵';
      case 'azure':
        return '🔷';
      default:
        return '☁️';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    const category = getResourceCategory(resourceType);
    switch (category) {
      case 'server':
        return <CloudServerOutlined />;
      case 'storage':
        return <DatabaseOutlined />;
      case 'network':
        return <GlobalOutlined />;
      default:
        return <CloudServerOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'active':
        return 'green';
      case 'stopped':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return '실행 중';
      case 'stopped':
        return '중지됨';
      case 'active':
        return '활성';
      case 'error':
        return '오류';
      default:
        return status;
    }
  };

  const handleCreateResource = (resourceType: string) => {
    if (!project) return;

    const routes = {
      server: {
        aws: `/cloud/ec2/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        gcp: `/cloud/gcp-vm/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        azure: `/cloud/azure-vm/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
      },
      storage: {
        aws: `/cloud/s3/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        gcp: `/cloud/gcp-storage/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        azure: `/cloud/azure-blob/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
      },
      network: {
        aws: `/cloud/vpc/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        gcp: `/cloud/gcp-vpc/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
        azure: `/cloud/azure-vnet/create?projectId=${project.id}&projectName=${encodeURIComponent(project.name)}`,
      },
    };

    const route =
      routes[resourceType as keyof typeof routes]?.[
        project.provider.type.toLowerCase() as keyof (typeof routes)['server']
      ];
    if (route) {
      navigate(route);
    }
  };

  // 리소스 필터링
  const getFilteredResources = () => {
    if (!project) return [];

    const resources = project.resources.filter((r) => {
      const category = getResourceCategory(r.type);
      return category !== 'other'; // other 제외
    });

    if (activeTab === 'all') return resources;
    return resources.filter((r) => getResourceCategory(r.type) === activeTab);
  };

  // 리소스 개수 계산
  const getResourceCounts = () => {
    if (!project) return { server: 0, storage: 0, network: 0, all: 0 };

    const filtered = project.resources.filter((r) => getResourceCategory(r.type) !== 'other');

    return {
      server: filtered.filter((r) => getResourceCategory(r.type) === 'server').length,
      storage: filtered.filter((r) => getResourceCategory(r.type) === 'storage').length,
      network: filtered.filter((r) => getResourceCategory(r.type) === 'network').length,
      all: filtered.length,
    };
  };

  const columns = [
    {
      title: '리소스',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Resource) => (
        <div className="resource-cell">
          <div className="resource-icon">{getResourceIcon(record.type)}</div>
          <div className="resource-info">
            <div className="resource-name">{text}</div>
            <div className="resource-type">{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
    },
    {
      title: '리전',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '비용',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (cost != null ? `$${cost.toLocaleString()}/월` : '-'),
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (date ? new Date(date).toLocaleDateString('ko-KR') : '-'),
    },
    {
      title: '작업',
      key: 'actions',
      render: (_: any, record: Resource) => {
        const items = [
          {
            key: 'start',
            icon: <PlayCircleOutlined />,
            label: '시작',
            disabled: record.status.toLowerCase() === 'running',
          },
          {
            key: 'stop',
            icon: <PauseCircleOutlined />,
            label: '중지',
            disabled: record.status.toLowerCase() === 'stopped',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '설정',
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '삭제',
            danger: true,
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const counts = getResourceCounts();

  const tabItems = [
    {
      key: 'all',
      label: (
        <span className="tab-label">
          <CloudServerOutlined />
          전체 <Badge count={counts.all} showZero />
        </span>
      ),
    },
    {
      key: 'server',
      label: (
        <span className="tab-label">
          <CloudServerOutlined />
          서버 <Badge count={counts.server} showZero />
        </span>
      ),
    },
    {
      key: 'storage',
      label: (
        <span className="tab-label">
          <DatabaseOutlined />
          스토리지 <Badge count={counts.storage} showZero />
        </span>
      ),
    },
    {
      key: 'network',
      label: (
        <span className="tab-label">
          <GlobalOutlined />
          네트워크 <Badge count={counts.network} showZero />
        </span>
      ),
    },
  ];

  if (!project && !loading) {
    return (
      <div className="project-resources-page">
        <Card>
          <div className="empty-state">
            <Title level={3}>프로젝트를 찾을 수 없습니다</Title>
            <Button type="primary" onClick={() => navigate('/cloud/project-selection')}>
              프로젝트 선택으로 돌아가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="project-resources-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/cloud/project-selection')}
            className="back-button"
          >
            프로젝트 선택으로 돌아가기
          </Button>
          <div className="project-header">
            <div className="project-title-section">
              <Avatar size="large" className="project-avatar">
                {project && getProviderIcon(project.provider.type)}
              </Avatar>
              <div className="project-details">
                <Title level={2} className="project-name">
                  {project?.name}
                </Title>
                <Text type="secondary" className="project-organization">
                  {project?.organization.name} • {project?.provider.name}
                </Text>
              </div>
            </div>
            <div className="project-stats">
              <Badge count={counts.all} showZero color="var(--color-primary)">
                <Tag color="blue">리소스</Tag>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 리소스 생성 버튼 */}
      <Card className="create-actions-card">
        <div className="create-actions-header">
          <Title level={4}>리소스 생성</Title>
          <Text type="secondary">새로운 클라우드 리소스를 생성하세요</Text>
        </div>
        <div className="create-actions-buttons">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateResource('server')}
            className="create-btn server"
          >
            <CloudServerOutlined /> 서버 생성
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateResource('storage')}
            className="create-btn storage"
          >
            <DatabaseOutlined /> 스토리지 생성
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateResource('network')}
            className="create-btn network"
          >
            <GlobalOutlined /> 네트워크 생성
          </Button>
        </div>
      </Card>

      {/* 리소스 목록 테이블 */}
      <Card className="resources-table-card">
        <div className="table-header">
          <Title level={4} className="table-title">
            리소스 목록
          </Title>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="resource-tabs"
        />

        <Table
          columns={columns}
          dataSource={getFilteredResources()}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `총 ${total}개`,
          }}
          locale={{
            emptyText: '생성된 리소스가 없습니다',
          }}
        />
      </Card>
    </div>
  );
};

export default ProjectResourcesPage;
