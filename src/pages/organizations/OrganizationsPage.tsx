import React, { useState } from 'react';
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
  Tooltip,
  Statistic,
  Row,
  Col,
  Typography,
  Descriptions,
  Badge,
  Divider,
  Spin,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  DollarOutlined,
  CalendarOutlined,
  FolderOutlined,
  ReloadOutlined,
  MinusCircleOutlined,
  UserOutlined,
  MailOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Organization,
  OrganizationStatus,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
  OrganizationMember,
  OrganizationMemberRole,
} from '@/types';
import { organizationService } from '@/services/organizationService';
import { formatDate, formatCurrency } from '@/utils/format';
import './OrganizationsPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const OrganizationsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 조직 목록 조회 (React Query)
  const {
    data: organizationsData,
    isLoading: isLoadingOrganizations,
    refetch: refetchOrganizations,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationService.getOrganizations(),
  });

  // 조직 수 조회 (React Query)
  const { data: organizationCount } = useQuery({
    queryKey: ['organizationCount'],
    queryFn: () => organizationService.getOrganizationCount(),
  });

  // 선택된 조직의 테넌트 조회 (React Query)
  const {
    data: selectedTenant,
    isLoading: isLoadingTenant,
    refetch: refetchTenant,
  } = useQuery({
    queryKey: ['organizationTenant', selectedOrganization?.id],
    queryFn: () =>
      selectedOrganization
        ? organizationService.getOrganizationTenant(selectedOrganization.id)
        : null,
    enabled: !!selectedOrganization,
  });

  // 조직 생성 Mutation
  const createMutation = useMutation({
    mutationFn: (data: OrganizationCreateRequest) => organizationService.createOrganization(data),
    onSuccess: () => {
      message.success('조직이 성공적으로 생성되었습니다.');
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizationCount'] });
    },
    onError: () => {
      message.error('조직 생성에 실패했습니다.');
    },
  });

  // 조직 수정 Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrganizationUpdateRequest }) =>
      organizationService.updateOrganization(id, data),
    onSuccess: () => {
      message.success('조직이 성공적으로 수정되었습니다.');
      setModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: () => {
      message.error('조직 수정에 실패했습니다.');
    },
  });

  // 조직 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => organizationService.deleteOrganization(id),
    onSuccess: () => {
      message.success('조직이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizationCount'] });
    },
    onError: () => {
      message.error('조직 삭제에 실패했습니다.');
    },
  });

  const organizations = organizationsData?.content || [];

  // 통계 계산
  const getStats = () => {
    const totalOrganizations = organizations.length;
    const activeOrganizations = organizations.filter((o) => o.status === 'ACTIVE').length;
    const totalProjects = organizations.reduce((sum, o) => sum + (o.totalProjects || 0), 0);
    const totalCost = organizations.reduce((sum, o) => sum + (o.totalCost || 0), 0);

    return {
      totalOrganizations,
      activeOrganizations,
      totalProjects,
      totalCost,
    };
  };

  const handleAddOrganization = () => {
    setEditingOrganization(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
    setModalVisible(true);
    form.setFieldsValue(organization);
  };

  const handleDeleteOrganization = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleViewDetail = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDetailModalVisible(true);
  };

  const handleModalSubmit = async (
    values: OrganizationCreateRequest | OrganizationUpdateRequest
  ) => {
    if (editingOrganization) {
      updateMutation.mutate({ id: editingOrganization.id, data: values });
    } else {
      createMutation.mutate(values as OrganizationCreateRequest);
    }
  };

  const getStatusConfig = (status: OrganizationStatus) => {
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
      default:
        return {
          color: 'default',
          icon: <TeamOutlined />,
          text: '알 수 없음',
          className: 'status-unknown',
        };
    }
  };

  const getTenantStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { color: 'success', text: '활성' };
      case 'INACTIVE':
        return { color: 'default', text: '비활성' };
      case 'SUSPENDED':
        return { color: 'warning', text: '정지' };
      case 'PENDING':
        return { color: 'processing', text: '대기중' };
      default:
        return { color: 'default', text: status };
    }
  };

  const getTenantTypeConfig = (type: string) => {
    switch (type) {
      case 'DEDICATED':
        return { color: 'purple', text: '전용' };
      case 'SHARED':
        return { color: 'blue', text: '공유' };
      case 'TRIAL':
        return { color: 'orange', text: '트라이얼' };
      default:
        return { color: 'default', text: type };
    }
  };

  const getRoleConfig = (role: OrganizationMemberRole) => {
    switch (role) {
      case 'OWNER':
        return { color: '#f59e0b', icon: <CrownOutlined />, text: '소유자' };
      case 'ADMIN':
        return { color: 'var(--color-primary)', icon: <TeamOutlined />, text: '관리자' };
      case 'MEMBER':
        return { color: 'var(--color-success)', icon: <UserOutlined />, text: '멤버' };
      case 'VIEWER':
        return { color: 'var(--text-tertiary)', icon: <EyeOutlined />, text: '뷰어' };
      default:
        return { color: 'var(--text-tertiary)', icon: <UserOutlined />, text: role };
    }
  };

  const columns = [
    {
      title: '조직',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Organization) => (
        <div className="organization-cell">
          <div className="organization-icon-wrapper">
            <TeamOutlined className="organization-icon" />
          </div>
          <div className="organization-info">
            <div className="organization-name">{text}</div>
            <div className="organization-description">{record.description || '-'}</div>
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
          <Tag color={config.color} icon={config.icon} className={`status-tag ${config.className}`}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '프로젝트 수',
      dataIndex: 'totalProjects',
      key: 'totalProjects',
      render: (totalProjects: number) => (
        <div className="projects-cell">
          <Badge count={totalProjects} showZero color="blue" />
          <span className="projects-label">개 프로젝트</span>
        </div>
      ),
    },
    {
      title: '조직원',
      dataIndex: 'members',
      key: 'members',
      render: (members: OrganizationMember[] | undefined) => (
        <div className="members-cell">
          <Badge count={members?.length || 0} showZero color="green" style={{ marginRight: 8 }} />
          <span className="members-count">명</span>
        </div>
      ),
    },
    {
      title: '월 비용',
      dataIndex: 'totalCost',
      key: 'totalCost',
      render: (cost: number) => (
        <div className="cost-cell">
          <div className="cost-amount">{cost ? formatCurrency(cost) : '-'}</div>
          {cost > 0 && (
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
      render: (record: Organization) => (
        <div className="actions-cell">
          <Space>
            <Tooltip title="상세 보기">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
                className="action-btn view-btn"
              />
            </Tooltip>
            <Tooltip title="편집">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditOrganization(record)}
                className="action-btn edit-btn"
              />
            </Tooltip>
            <Popconfirm
              title="이 조직을 삭제하시겠습니까?"
              description="조직을 삭제하면 관련된 모든 프로젝트와 리소스에 영향을 줄 수 있습니다."
              onConfirm={() => handleDeleteOrganization(record.id)}
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
    <div className="organizations-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              조직 관리
            </Title>
            <Text className="page-description">
              조직을 생성하고 관리합니다. 각 조직은 여러 프로젝트와 리소스를 포함할 수 있습니다.
            </Text>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddOrganization}
              className="add-organization-btn"
              size="large"
            >
              조직 생성
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-organizations">
            <Statistic
              title="총 조직 수"
              value={organizationCount ?? stats.totalOrganizations}
              prefix={<TeamOutlined />}
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card active-organizations">
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
              title="총 프로젝트"
              value={stats.totalProjects}
              prefix={<FolderOutlined />}
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

      {/* 조직 목록 */}
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
              icon={<ReloadOutlined />}
              onClick={() => refetchOrganizations()}
              loading={isLoadingOrganizations}
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
            loading={isLoadingOrganizations}
            rowKey="id"
            className="organizations-table"
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

      {/* 조직 생성/편집 모달 */}
      <Modal
        title={
          <div className="modal-title">
            <div className="modal-title-icon">
              {editingOrganization ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <div className="modal-title-text">
              {editingOrganization ? '조직 편집' : '새 조직 생성'}
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        className="organization-modal"
        okText={editingOrganization ? '변경사항 저장' : '조직 생성'}
        cancelText="취소"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          className="organization-form"
        >
          {/* 기본 정보 섹션 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-icon"></div>
              <div className="form-section-title">기본 정보</div>
            </div>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="조직 이름"
                  rules={[{ required: true, message: '조직 이름을 입력해주세요.' }]}
                >
                  <Input
                    placeholder="예: E-Commerce Platform Organization"
                    prefix={<TeamOutlined />}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
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
                    <Option value="SUSPENDED">
                      <div className="status-option">
                        <ExclamationCircleOutlined className="status-icon suspended" />
                        <span>정지</span>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="조직 설명">
              <Input.TextArea
                placeholder="조직에 대한 간단한 설명을 입력해주세요."
                rows={3}
                size="large"
              />
            </Form.Item>
          </div>

          {/* 조직원 추가 섹션 */}
          <div className="members-section">
            <div className="members-header">
              <div className="members-title">
                <span>조직원 추가</span>
              </div>
              <Text type="secondary" className="members-description">
                조직에 소속될 멤버를 추가합니다.
              </Text>
            </div>

            <Form.List name="members">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="member-item">
                      <Row gutter={12} align="middle">
                        <Col span={7}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            rules={[{ required: true, message: '이름 입력' }]}
                            className="member-form-item"
                          >
                            <Input prefix={<UserOutlined />} placeholder="이름" size="middle" />
                          </Form.Item>
                        </Col>
                        <Col span={9}>
                          <Form.Item
                            {...restField}
                            name={[name, 'email']}
                            rules={[
                              { required: true, message: '이메일 입력' },
                              { type: 'email', message: '올바른 이메일 형식' },
                            ]}
                            className="member-form-item"
                          >
                            <Input prefix={<MailOutlined />} placeholder="이메일" size="middle" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            {...restField}
                            name={[name, 'role']}
                            initialValue="MEMBER"
                            className="member-form-item"
                          >
                            <Select size="middle" placeholder="역할">
                              <Option value="OWNER">
                                <div className="role-option">
                                  <CrownOutlined className="role-icon owner" />
                                  <span>소유자</span>
                                </div>
                              </Option>
                              <Option value="ADMIN">
                                <div className="role-option">
                                  <TeamOutlined className="role-icon admin" />
                                  <span>관리자</span>
                                </div>
                              </Option>
                              <Option value="MEMBER">
                                <div className="role-option">
                                  <UserOutlined className="role-icon member" />
                                  <span>멤버</span>
                                </div>
                              </Option>
                              <Option value="VIEWER">
                                <div className="role-option">
                                  <EyeOutlined className="role-icon viewer" />
                                  <span>뷰어</span>
                                </div>
                              </Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            className="remove-member-btn"
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="add-member-btn"
                    >
                      조직원 추가
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>

      {/* 조직 상세 모달 (테넌트 정보 포함) */}
      <Modal
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedOrganization(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            닫기
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailModalVisible(false);
              if (selectedOrganization) {
                handleEditOrganization(selectedOrganization);
              }
            }}
          >
            편집
          </Button>,
        ]}
        width={800}
        className="organization-detail-modal"
      >
        {selectedOrganization && (
          <div className="detail-content">
            {/* 조직 기본 정보 */}
            <div className="detail-section">
              <div className="section-header">
                <div className="section-icon">
                  <Title level={4} className="section-title">
                    기본 정보
                  </Title>
                </div>
              </div>
              <Descriptions bordered column={2} size="small" className="detail-descriptions">
                <Descriptions.Item label="조직 이름" span={2}>
                  <Text strong>{selectedOrganization.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="설명" span={2}>
                  {selectedOrganization.description || '-'}
                </Descriptions.Item>
                <Descriptions.Item label="상태">
                  <Tag
                    color={getStatusConfig(selectedOrganization.status).color}
                    icon={getStatusConfig(selectedOrganization.status).icon}
                  >
                    {getStatusConfig(selectedOrganization.status).text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="프로젝트 수">
                  <Badge count={selectedOrganization.totalProjects} showZero color="blue" />
                </Descriptions.Item>
                <Descriptions.Item label="월 비용">
                  {formatCurrency(selectedOrganization.totalCost)}
                </Descriptions.Item>
                <Descriptions.Item label="생성일">
                  {formatDate(selectedOrganization.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </div>

            <Divider />

            {/* 테넌트 정보 */}
            <div className="detail-section tenant-section">
              <div className="section-header">
                <div className="section-header-left">
                  <div className="section-icon tenant"></div>
                  <Title level={4} className="section-title">
                    테넌트 정보
                  </Title>
                </div>
                <div className="section-header-right">
                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={() => refetchTenant()}
                    loading={isLoadingTenant}
                    size="small"
                    className="refresh-btn"
                  >
                    새로고침
                  </Button>
                </div>
              </div>

              {isLoadingTenant ? (
                <div className="tenant-loading">
                  <Spin tip="테넌트 정보를 불러오는 중..." />
                </div>
              ) : selectedTenant ? (
                <div className="tenant-info">
                  <Row gutter={[24, 16]}>
                    <Col span={12}>
                      <Card className="tenant-card" size="small">
                        <div className="tenant-card-header">
                          <Text strong>테넌트 기본 정보</Text>
                        </div>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="테넌트 키">
                            <Text code>{selectedTenant.tenantKey}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="테넌트 이름">
                            {selectedTenant.tenantName}
                          </Descriptions.Item>
                          <Descriptions.Item label="상태">
                            <Tag color={getTenantStatusConfig(selectedTenant.status).color}>
                              {getTenantStatusConfig(selectedTenant.status).text}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item label="유형">
                            <Tag color={getTenantTypeConfig(selectedTenant.tenantType).color}>
                              {getTenantTypeConfig(selectedTenant.tenantType).text}
                            </Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className="tenant-card" size="small">
                        <div className="tenant-card-header">
                          <Text strong>리소스 할당량</Text>
                        </div>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="최대 사용자">
                            {selectedTenant.maxUsers}명
                          </Descriptions.Item>
                          <Descriptions.Item label="최대 리소스">
                            {selectedTenant.maxResources}개
                          </Descriptions.Item>
                          <Descriptions.Item label="스토리지">
                            {selectedTenant.storageQuotaGb} GB
                          </Descriptions.Item>
                          <Descriptions.Item label="대역폭">
                            {selectedTenant.bandwidthQuotaGb} GB
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className="tenant-card" size="small">
                        <div className="tenant-card-header">
                          <Text strong>연락처 정보</Text>
                        </div>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="이메일">
                            {selectedTenant.contactEmail}
                          </Descriptions.Item>
                          <Descriptions.Item label="전화번호">
                            {selectedTenant.contactPhone}
                          </Descriptions.Item>
                          <Descriptions.Item label="청구 주소">
                            {selectedTenant.billingAddress}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className="tenant-card" size="small">
                        <div className="tenant-card-header">
                          <Text strong>구독 정보</Text>
                        </div>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="시작일">
                            {formatDate(selectedTenant.subscriptionStartDate)}
                          </Descriptions.Item>
                          <Descriptions.Item label="종료일">
                            {formatDate(selectedTenant.subscriptionEndDate)}
                          </Descriptions.Item>
                          <Descriptions.Item label="트라이얼">
                            {selectedTenant.isTrial ? (
                              <Tag color="orange">트라이얼</Tag>
                            ) : (
                              <Tag color="green">정식</Tag>
                            )}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="no-tenant">
                  <div className="no-tenant-icon">
                    <div>
                      <br />
                    </div>
                  </div>
                  <Text type="secondary">이 조직에 연결된 테넌트가 없습니다.</Text>
                </div>
              )}
            </div>

            <Divider />

            {/* 조직원 정보 */}
            <div className="detail-section members-detail-section">
              <div className="section-header">
                <div className="section-header-left">
                  <div className="section-icon members"></div>
                  <Title level={4} className="section-title">
                    조직원 ({selectedOrganization.members?.length || 0}명)
                  </Title>
                </div>
              </div>

              {selectedOrganization.members && selectedOrganization.members.length > 0 ? (
                <div className="members-grid">
                  {selectedOrganization.members.map((member, index) => {
                    const roleConfig = getRoleConfig(member.role);
                    return (
                      <div>
                        <div key={member.id || index} className="member-card">
                          <Tag
                            className="member-card-role"
                            style={{
                              borderColor: roleConfig.color,
                              color: roleConfig.color,
                            }}
                          >
                            {roleConfig.icon}
                            <span style={{ marginLeft: 4 }}>{roleConfig.text}</span>
                          </Tag>
                          <div className="member-card-info">
                            <div className="member-card-email">{member.email}</div>
                          </div>
                        </div>
                        <br />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-members-detail">
                  <UserOutlined className="no-members-icon" />
                  <Text type="secondary">조직원이 없습니다.</Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrganizationsPage;
