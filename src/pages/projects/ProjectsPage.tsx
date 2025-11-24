import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Badge,
  Tooltip,
  Statistic,
  Row,
  Col,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  DollarOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Project, ProjectStatus, CloudProvider, ProviderType, Organization } from '@/types';
import { projectService } from '@/services/projectService';
import { cloudService } from '@/services/cloudService';
import { organizationService } from '@/services/organizationService';
import { formatDate, formatCurrency } from '@/utils/format';
import './ProjectsPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProjects();
    fetchProviders();
    fetchOrganizations();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects();
      setProjects(response.content || []);
    } catch (error) {
      message.error('프로젝트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await cloudService.getProviders();
      setProviders(response.content || []);
    } catch (error) {
      console.error('프로바이더 목록을 불러오는데 실패했습니다.');
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await organizationService.getOrganizations();
      setOrganizations(response.content || []);
    } catch (error) {
      console.error('조직 목록을 불러오는데 실패했습니다.');
    }
  };

  // 통계 계산
  const getStats = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
    const totalResources = projects.reduce((sum, p) => sum + (p.resources?.length || 0), 0);
    const totalCost = projects.reduce((sum, p) => sum + (p.cost || 0), 0);

    return {
      totalProjects,
      activeProjects,
      totalResources,
      totalCost,
    };
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setModalVisible(true);
    form.setFieldsValue(project);
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectService.deleteProject(id);
      message.success('프로젝트가 삭제되었습니다.');
      fetchProjects();
    } catch (error) {
      message.error('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleModalSubmit = async (values: any) => {
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, values);
        message.success('프로젝트가 수정되었습니다.');
      } else {
        await projectService.createProject(values);
        message.success('프로젝트가 생성되었습니다.');
      }
      setModalVisible(false);
      fetchProjects();
    } catch (error) {
      message.error('프로젝트 저장에 실패했습니다.');
    }
  };

  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          text: '활성',
          className: 'status-active',
        };
      case 'INACTIVE':
        return {
          color: 'default',
          icon: <StopOutlined />,
          text: '비활성',
          className: 'status-inactive',
        };
      case 'SUSPENDED':
        return {
          color: 'warning',
          icon: <ExclamationCircleOutlined />,
          text: '정지',
          className: 'status-suspended',
        };
      case 'ARCHIVED':
        return {
          color: 'default',
          icon: <StopOutlined />,
          text: '아카이브',
          className: 'status-archived',
        };
      default:
        return {
          color: 'default',
          icon: <FolderOutlined />,
          text: '알 수 없음',
          className: 'status-unknown',
        };
    }
  };

  const getProviderIcon = (type: ProviderType) => {
    const iconMap = {
      AWS: <ThunderboltOutlined className="provider-icon aws-icon" />,
      GCP: <DatabaseOutlined className="provider-icon gcp-icon" />,
      AZURE: <CloudOutlined className="provider-icon azure-icon" />,
    };
    return iconMap[type] || <CloudOutlined className="provider-icon" />;
  };

  const columns = [
    {
      title: '프로젝트',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Project) => (
        <div className="project-cell">
          <div className="project-icon-wrapper">
            <FolderOutlined className="project-icon" />
          </div>
          <div className="project-info">
            <div className="project-name">{text}</div>
            <div className="project-description">{record.description || '-'}</div>
            <div className="project-organization">
              <Text type="secondary" className="org-label">
                🏢 {record.organization.name}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '프로바이더',
      key: 'provider',
      render: (record: Project) => (
        <div className="provider-cell">
          <div className="provider-icon-wrapper">{getProviderIcon(record.provider.type)}</div>
          <div className="provider-info">
            <div className="provider-name">{record.provider.name}</div>
            <div className="provider-type">{record.provider.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProjectStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className={`status-tag ${config.className}`}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '리소스',
      key: 'resources',
      render: (record: Project) => {
        const totalResources = record.resources?.length || 0;
        const runningResources =
          record.resources?.filter((r) => r.status === 'RUNNING').length || 0;
        return (
          <div className="resources-cell">
            <div className="resource-count">
              <Badge count={totalResources} showZero color="blue" />
              <span className="resource-label">총 리소스</span>
            </div>
            <div className="resource-detail">
              <Text type="secondary" className="running-count">
                실행 중: {runningResources}개
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: '월 비용',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => (
        <div className="cost-cell">
          <div className="cost-amount">{cost ? formatCurrency(cost) : '-'}</div>
          {cost && (
            <div className="cost-icon">
              <DollarOutlined />
            </div>
          )}
        </div>
      ),
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="date-cell">
          <CalendarOutlined className="date-icon" />
          <Text type="secondary">{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: '작업',
      key: 'actions',
      render: (record: Project) => (
        <div className="actions-cell">
          <Space>
            <Tooltip title="상세 보기">
              <Button type="text" icon={<EyeOutlined />} className="action-btn view-btn" />
            </Tooltip>
            <Tooltip title="편집">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditProject(record)}
                className="action-btn edit-btn"
              />
            </Tooltip>
            <Popconfirm
              title="이 프로젝트를 삭제하시겠습니까?"
              onConfirm={() => handleDeleteProject(record.id)}
              okText="삭제"
              cancelText="취소"
              okType="danger"
            >
              <Tooltip title="삭제">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className="action-btn delete-btn"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  const stats = getStats();

  return (
    <div className="projects-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              프로젝트 관리
            </Title>
            <Text className="page-description">
              조직별 프로젝트를 관리합니다. 각 프로젝트는 하나의 클라우드 프로바이더와 연결됩니다.
            </Text>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProject}
              className="add-project-btn"
              size="large"
            >
              프로젝트 생성
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-projects">
            <Statistic
              title="총 프로젝트"
              value={stats.totalProjects}
              prefix={<FolderOutlined />}
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card active-projects">
            <Statistic
              title="활성 프로젝트"
              value={stats.activeProjects}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'var(--color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-resources">
            <Statistic
              title="총 리소스"
              value={stats.totalResources}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: 'var(--color-info)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-cost">
            <Statistic
              title="월 총 비용"
              value={stats.totalCost}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: 'var(--color-warning)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 프로젝트 목록 */}
      <Card className="projects-card glass-card">
        <div className="card-header">
          <div className="card-title">
            <Title level={3} className="card-title-text">
              프로젝트 목록
            </Title>
            <Text className="card-description">
              총 {projects.length}개의 프로젝트가 등록되어 있습니다.
            </Text>
          </div>
          <div className="card-actions">
            <Button
              icon={<FolderOutlined />}
              onClick={fetchProjects}
              loading={loading}
              className="refresh-btn"
            >
              새로고침
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={projects}
            loading={loading}
            rowKey="id"
            className="projects-table"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
              className: 'table-pagination',
            }}
          />
        </div>
      </Card>

      {/* 프로젝트 생성/편집 모달 */}
      <Modal
        title={
          <div className="modal-title">
            <div className="modal-title-icon">
              {editingProject ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <div className="modal-title-text">
              {editingProject ? '프로젝트 편집' : '프로젝트 생성'}
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
        className="project-modal"
        okText="저장"
        cancelText="취소"
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit} className="project-form">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="프로젝트 이름"
                rules={[{ required: true, message: '프로젝트 이름을 입력해주세요.' }]}
              >
                <Input
                  placeholder="예: E-Commerce Platform"
                  prefix={<FolderOutlined />}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label="프로젝트 설명">
                <Input.TextArea
                  placeholder="프로젝트에 대한 간단한 설명을 입력해주세요."
                  rows={3}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="organizationId"
                label="조직"
                rules={[{ required: true, message: '조직을 선택해주세요.' }]}
              >
                <Select placeholder="조직을 선택하세요" size="large">
                  {organizations.map((organization) => (
                    <Option key={organization.id} value={organization.id}>
                      <div className="organization-option">
                        <span className="org-icon">🏢</span>
                        <span>{organization.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="providerId"
                label="프로바이더"
                rules={[{ required: true, message: '프로바이더를 선택해주세요.' }]}
              >
                <Select placeholder="프로바이더를 선택하세요" size="large">
                  {providers.map((provider) => (
                    <Option key={provider.id} value={provider.id}>
                      <div className="provider-option">
                        {getProviderIcon(provider.type)}
                        <span>
                          {provider.name} ({provider.type})
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="status" label="상태" initialValue="ACTIVE">
                <Select size="large">
                  <Option value="ACTIVE">
                    <div className="status-option">
                      <CheckCircleOutlined className="status-icon active" />
                      <span>활성</span>
                    </div>
                  </Option>
                  <Option value="INACTIVE">
                    <div className="status-option">
                      <StopOutlined className="status-icon inactive" />
                      <span>비활성</span>
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;
