import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  ApartmentOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  StopOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Organization, OrganizationStatus, OrganizationTenant } from '@/types';
import { organizationService } from '@/services/organizationService';
import { tenantService } from '@/services/tenantService';
import { formatCurrency, formatDate } from '@/utils/format';
import './OrganizationsPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const OrganizationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [form] = Form.useForm();

  /**
   * Queries
   */
  const {
    data: organizationPage,
    isLoading: isOrganizationsLoading,
    refetch: refetchOrganizations,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getOrganizations(),
  });

  const organizations = organizationPage?.content ?? [];

  const { data: organizationCountData } = useQuery({
    queryKey: ['organizations', 'count'],
    queryFn: () => organizationService.getOrganizationCount(),
    staleTime: 60 * 1000,
  });

  const {
    data: tenantResponse,
    isLoading: isTenantLoading,
    isError: isTenantError,
  } = useQuery({
    queryKey: ['organizationTenant', selectedOrganization?.id],
    enabled: !!selectedOrganization,
    queryFn: () =>
      tenantService.getOrganizationTenant(selectedOrganization ? selectedOrganization.id : 0),
  });

  const tenant: OrganizationTenant | undefined = tenantResponse?.data;
  const hasTenant = !!tenant;

  /**
   * Mutations
   */
  const createMutation = useMutation({
    mutationFn: (payload: Partial<Organization>) => organizationService.createOrganization(payload),
    onSuccess: () => {
      message.success('조직이 생성되었습니다.');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', 'count'] });
    },
    onError: () => {
      message.error('조직 생성에 실패했습니다.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; payload: Partial<Organization> }) =>
      organizationService.updateOrganization(variables.id, variables.payload),
    onSuccess: () => {
      message.success('조직이 수정되었습니다.');
      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: () => {
      message.error('조직 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => organizationService.deleteOrganization(id),
    onSuccess: () => {
      message.success('조직이 삭제되었습니다.');
      if (selectedOrganization && organizations.every((o) => o.id !== selectedOrganization.id)) {
        setSelectedOrganization(null);
      }
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', 'count'] });
    },
    onError: () => {
      message.error('조직 삭제에 실패했습니다.');
    },
  });

  /**
   * Handlers
   */
  const handleOpenCreateModal = () => {
    setEditingOrganization(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (organization: Organization) => {
    setEditingOrganization(organization);
    form.setFieldsValue({
      name: organization.name,
      description: organization.description,
      status: organization.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteOrganization = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (values: any) => {
    if (editingOrganization) {
      updateMutation.mutate({
        id: editingOrganization.id,
        payload: values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleRowClick = (record: Organization) => {
    setSelectedOrganization(record);
  };

  /**
   * Helpers
   */
  const getStatusConfig = (status: OrganizationStatus) => {
    switch (status) {
      case 'ACTIVE':
        return {
          color: 'success' as const,
          text: '활성',
          className: 'status-active',
          icon: <CheckCircleOutlined />,
        };
      case 'INACTIVE':
        return {
          color: 'default' as const,
          text: '비활성',
          className: 'status-inactive',
          icon: <StopOutlined />,
        };
      case 'SUSPENDED':
        return {
          color: 'warning' as const,
          text: '정지',
          className: 'status-suspended',
          icon: <ExclamationCircleOutlined />,
        };
      default:
        return {
          color: 'default' as const,
          text: '알 수 없음',
          className: 'status-unknown',
          icon: <ApartmentOutlined />,
        };
    }
  };

  const stats = useMemo(() => {
    const totalOrganizations = organizationCountData ?? organizations.length;
    const activeOrganizations = organizations.filter((o) => o.status === 'ACTIVE').length;
    const totalProjects = organizations.reduce((sum, o) => sum + (o.totalProjects || 0), 0);
    const totalCost = organizations.reduce((sum, o) => sum + (o.totalCost || 0), 0);

    return {
      totalOrganizations,
      activeOrganizations,
      totalProjects,
      totalCost,
    };
  }, [organizationCountData, organizations]);

  const columns = [
    {
      title: '조직 이름',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Organization) => (
        <div className="org-cell">
          <div className="org-icon-wrapper">
            <ApartmentOutlined className="org-icon" />
          </div>
          <div className="org-info">
            <div className="org-name">{text}</div>
            <div className="org-description">{record.description || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrganizationStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag
            color={config.color}
            icon={config.icon}
            className={`status-tag ${config.className}`}
          >
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '프로젝트 수',
      dataIndex: 'totalProjects',
      key: 'totalProjects',
      render: (value: number) => (
        <div className="org-metric">
          <Badge count={value ?? 0} showZero color="blue" />
        </div>
      ),
    },
    {
      title: '월 비용',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (value: number) => (
        <div className="cost-cell">{value ? formatCurrency(value) : '-'}</div>
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
      render: (record: Organization) => (
        <div className="actions-cell">
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
              className="action-btn edit-btn"
            >
              편집
            </Button>
            <Popconfirm
              title="이 조직을 삭제하시겠습니까?"
              okText="삭제"
              cancelText="취소"
              okType="danger"
              onConfirm={() => handleDeleteOrganization(record.id)}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="action-btn delete-btn"
              >
                삭제
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div className="organizations-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              조직 관리
            </Title>
            <Text className="page-description">
              조직을 생성·수정·삭제하고, 조직별 테넌트 정보를 조회합니다.
            </Text>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="add-org-btn"
              onClick={handleOpenCreateModal}
            >
              조직 생성
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-orgs">
            <Statistic
              title="총 조직 수"
              value={stats.totalOrganizations}
              prefix={<ApartmentOutlined />}
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card active-orgs">
            <Statistic
              title="활성 조직"
              value={stats.activeOrganizations}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'var(--color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-projects">
            <Statistic
              title="총 프로젝트 수"
              value={stats.totalProjects}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'var(--color-info)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-cost">
            <Statistic
              title="월 총 비용"
              value={stats.totalCost}
              prefix={<ExclamationCircleOutlined />}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: 'var(--color-warning)' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="content-section">
        <Col xs={24} xl={16}>
          <Card className="organizations-card glass-card">
            <div className="card-header">
              <div className="card-title">
                <Title level={3} className="card-title-text">
                  조직 목록
                </Title>
                <Text className="card-description">
                  총 {organizations.length}개의 조직이 등록되어 있습니다.
                </Text>
              </div>
              <div className="card-actions">
                <Button
                  onClick={() => refetchOrganizations()}
                  loading={isOrganizationsLoading}
                  className="refresh-btn"
                >
                  새로고침
                </Button>
              </div>
            </div>

            <div className="table-container">
              <Table
                columns={columns}
                dataSource={organizations}
                loading={isOrganizationsLoading}
                rowKey="id"
                className="organizations-table"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
                  className: 'table-pagination',
                }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card className="tenant-card glass-card">
            <div className="card-header">
              <div className="card-title">
                <Title level={3} className="card-title-text">
                  조직 테넌트 정보
                </Title>
                <Text className="card-description">
                  조직을 선택하면 해당 조직에 연결된 테넌트 정보를 조회합니다.
                </Text>
              </div>
            </div>

            {!selectedOrganization && (
              <div className="tenant-empty">
                <Text type="secondary">왼쪽 목록에서 조직을 선택해주세요.</Text>
              </div>
            )}

            {selectedOrganization && (
              <div className="tenant-content">
                <div className="tenant-header">
                  <div className="tenant-org-name">
                    <ApartmentOutlined className="tenant-org-icon" />
                    <span>{selectedOrganization.name}</span>
                  </div>
                  <div className="tenant-status">
                    <Badge
                      status={hasTenant ? 'success' : 'default'}
                      text={hasTenant ? '테넌트 존재' : '테넌트 없음'}
                    />
                  </div>
                </div>

                {isTenantLoading && (
                  <div className="tenant-loading">
                    <Text type="secondary">테넌트 정보를 불러오는 중입니다...</Text>
                  </div>
                )}

                {isTenantError && (
                  <div className="tenant-error">
                    <Text type="danger">테넌트 정보를 불러오는데 실패했습니다.</Text>
                  </div>
                )}

                {!isTenantLoading && !isTenantError && !tenant && (
                  <div className="tenant-empty">
                    <Text type="secondary">연결된 테넌트가 없습니다.</Text>
                  </div>
                )}

                {tenant && (
                  <div className="tenant-details">
                    <div className="tenant-section">
                      <div className="section-title">테넌트 기본 정보</div>
                      <div className="section-row">
                        <span className="label">테넌트 이름</span>
                        <span className="value">{tenant.tenantName}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">테넌트 키</span>
                        <span className="value code">{tenant.tenantKey}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">설명</span>
                        <span className="value">{tenant.description || '-'}</span>
                      </div>
                    </div>

                    <div className="tenant-section">
                      <div className="section-title">상태 및 타입</div>
                      <div className="section-row">
                        <span className="label">상태</span>
                        <span className="value">
                          <Tag
                            color={tenant.status === 'ACTIVE' ? 'success' : 'default'}
                            className="tenant-status-tag"
                          >
                            {tenant.status}
                          </Tag>
                        </span>
                      </div>
                      <div className="section-row">
                        <span className="label">타입</span>
                        <span className="value">{tenant.tenantType}</span>
                      </div>
                    </div>

                    <div className="tenant-section">
                      <div className="section-title">리소스 한도</div>
                      <div className="section-row">
                        <span className="label">최대 사용자 수</span>
                        <span className="value">{tenant.maxUsers}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">최대 리소스 수</span>
                        <span className="value">{tenant.maxResources}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">스토리지(GB)</span>
                        <span className="value">{tenant.storageQuotaGb}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">대역폭(GB)</span>
                        <span className="value">{tenant.bandwidthQuotaGb}</span>
                      </div>
                    </div>

                    <div className="tenant-section">
                      <div className="section-title">연락처</div>
                      <div className="section-row">
                        <span className="label">이메일</span>
                        <span className="value">{tenant.contactEmail}</span>
                      </div>
                      <div className="section-row">
                        <span className="label">전화번호</span>
                        <span className="value">{tenant.contactPhone || '-'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 조직 생성 / 수정 모달 */}
      <Modal
        title={
          <div className="modal-title">
            <div className="modal-title-icon">
              {editingOrganization ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <div className="modal-title-text">
              {editingOrganization ? '조직 수정' : '조직 생성'}
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="저장"
        cancelText="취소"
        width={600}
        className="organization-modal"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="organization-form">
          <Form.Item
            name="name"
            label="조직 이름"
            rules={[{ required: true, message: '조직 이름을 입력해주세요.' }]}
          >
            <Input placeholder="예: 개발팀" size="large" prefix={<ApartmentOutlined />} />
          </Form.Item>

          <Form.Item name="description" label="설명">
            <Input.TextArea
              placeholder="조직에 대한 간단한 설명을 입력해주세요."
              rows={3}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="상태"
            rules={[{ required: true, message: '상태를 선택해주세요.' }]}
          >
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
              <Option value="SUSPENDED">
                <div className="status-option">
                  <ExclamationCircleOutlined className="status-icon suspended" />
                  <span>정지</span>
                </div>
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationsPage;


