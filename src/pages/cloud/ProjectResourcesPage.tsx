import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Badge,
  Dropdown,
  Avatar,
  Tabs,
  Modal,
  message,
  Popconfirm,
  Input,
  Space,
} from 'antd';
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
  ExclamationCircleOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');

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

  /**
   * 리소스 시작
   */
  const handleStartResource = async (resource: Resource) => {
    try {
      message.loading({ content: `${resource.name} 시작 중...`, key: 'resourceAction' });

      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 상태 업데이트
      if (project) {
        const updatedResources = project.resources.map((r) =>
          r.id === resource.id ? { ...r, status: 'running' } : r
        );
        setProject({ ...project, resources: updatedResources });
      }

      message.success({ content: `${resource.name}이(가) 시작되었습니다`, key: 'resourceAction' });
    } catch (error) {
      message.error({ content: '리소스 시작 실패', key: 'resourceAction' });
      console.error('리소스 시작 실패:', error);
    }
  };

  /**
   * 리소스 중지
   */
  const handleStopResource = async (resource: Resource) => {
    try {
      message.loading({ content: `${resource.name} 중지 중...`, key: 'resourceAction' });

      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 상태 업데이트
      if (project) {
        const updatedResources = project.resources.map((r) =>
          r.id === resource.id ? { ...r, status: 'stopped' } : r
        );
        setProject({ ...project, resources: updatedResources });
      }

      message.success({ content: `${resource.name}이(가) 중지되었습니다`, key: 'resourceAction' });
    } catch (error) {
      message.error({ content: '리소스 중지 실패', key: 'resourceAction' });
      console.error('리소스 중지 실패:', error);
    }
  };

  /**
   * 리소스 설정
   */
  const handleSettingsResource = (resource: Resource) => {
    const projectId = searchParams.get('projectId');
    navigate(`/cloud/resource-settings?resourceId=${resource.id}&projectId=${projectId || ''}`);
  };

  /**
   * 리소스 이름 편집 시작
   */
  const handleStartEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setEditingName(resource.name);
  };

  /**
   * 리소스 이름 저장
   */
  const handleSaveName = async (resource: Resource) => {
    if (!editingName.trim()) {
      message.error('리소스 이름을 입력하세요');
      return;
    }

    try {
      message.loading({ content: '이름 변경 중...', key: 'updateName' });

      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 상태 업데이트
      if (project) {
        const updatedResources = project.resources.map((r) =>
          r.id === resource.id ? { ...r, name: editingName } : r
        );
        setProject({ ...project, resources: updatedResources });
      }

      setEditingId(null);
      setEditingName('');
      message.success({ content: '이름이 변경되었습니다', key: 'updateName' });
    } catch (error) {
      message.error({ content: '이름 변경 실패', key: 'updateName' });
      console.error('이름 변경 실패:', error);
    }
  };

  /**
   * 리소스 이름 편집 취소
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  /**
   * 리소스 삭제
   */
  const handleDeleteResource = async (resource: Resource) => {
    Modal.confirm({
      title: '리소스 삭제',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            정말로 <strong>{resource.name}</strong>을(를) 삭제하시겠습니까?
          </p>
          <p style={{ color: 'var(--color-error)', marginTop: '8px' }}>
            ⚠️ 이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.
          </p>
        </div>
      ),
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          message.loading({ content: `${resource.name} 삭제 중...`, key: 'resourceAction' });

          // Mock: 실제로는 API 호출
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // 리소스 제거
          if (project) {
            const updatedResources = project.resources.filter((r) => r.id !== resource.id);
            setProject({ ...project, resources: updatedResources });
          }

          message.success({
            content: `${resource.name}이(가) 삭제되었습니다`,
            key: 'resourceAction',
          });
        } catch (error) {
          message.error({ content: '리소스 삭제 실패', key: 'resourceAction' });
          console.error('리소스 삭제 실패:', error);
        }
      },
    });
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
            {editingId === record.id ? (
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onPressEnter={() => handleSaveName(record)}
                  placeholder="리소스 이름"
                  autoFocus
                  style={{ maxWidth: '250px' }}
                />
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleSaveName(record)}
                  size="small"
                />
                <Button icon={<CloseOutlined />} onClick={handleCancelEdit} size="small" />
              </Space.Compact>
            ) : (
              <div className="resource-name-wrapper">
                <div className="resource-name">{text}</div>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleStartEdit(record)}
                  className="edit-btn"
                />
              </div>
            )}
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
            onClick: () => handleStartResource(record),
          },
          {
            key: 'stop',
            icon: <PauseCircleOutlined />,
            label: '중지',
            disabled: record.status.toLowerCase() === 'stopped',
            onClick: () => handleStopResource(record),
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '설정',
            onClick: () => handleSettingsResource(record),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '삭제',
            danger: true,
            onClick: () => handleDeleteResource(record),
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
            type="text"
            onClick={() => handleCreateResource('server')}
            className="create-btn server"
          >
            <CloudServerOutlined />
            <span>서버 생성</span>
          </Button>
          <Button
            type="text"
            onClick={() => handleCreateResource('storage')}
            className="create-btn storage"
          >
            <DatabaseOutlined />
            <span>스토리지 생성</span>
          </Button>
          <Button
            type="text"
            onClick={() => handleCreateResource('network')}
            className="create-btn network"
          >
            <GlobalOutlined />
            <span>네트워크 생성</span>
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
