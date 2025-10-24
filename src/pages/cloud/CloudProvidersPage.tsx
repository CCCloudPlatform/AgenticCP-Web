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
  SyncOutlined,
  CloudOutlined,
  SettingOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { CloudProvider, ProviderType, ProviderStatus } from '@/types';
import { cloudService } from '@/services/cloudService';
import { formatDate, formatCurrency } from '@/utils/format';
import './CloudProvidersPage.scss';

const { Title, Text } = Typography;

const { Option } = Select;

const CloudProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CloudProvider | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await cloudService.getProviders();
      setProviders(response.content || []);
    } catch (error) {
      message.error('프로바이더 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 통계 계산
  const getStats = () => {
    const totalProviders = providers.length;
    const activeProviders = providers.filter((p) => p.status === 'ACTIVE').length;
    const totalResources = providers.reduce((sum, p) => sum + (p.resources?.length || 0), 0);
    const totalCost = providers.reduce((sum, p) => sum + (p.cost || 0), 0);

    return {
      totalProviders,
      activeProviders,
      totalResources,
      totalCost,
    };
  };

  const handleAddProvider = () => {
    setEditingProvider(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditProvider = (provider: CloudProvider) => {
    setEditingProvider(provider);
    setModalVisible(true);
    form.setFieldsValue(provider);
  };

  const handleDeleteProvider = async (id: number) => {
    try {
      await cloudService.deleteProvider(id);
      message.success('프로바이더가 삭제되었습니다.');
      fetchProviders();
    } catch (error) {
      message.error('프로바이더 삭제에 실패했습니다.');
    }
  };

  const handleModalSubmit = async (values: any) => {
    try {
      if (editingProvider) {
        await cloudService.updateProvider(editingProvider.id, values);
        message.success('프로바이더가 수정되었습니다.');
      } else {
        await cloudService.createProvider(values);
        message.success('프로바이더가 추가되었습니다.');
      }
      setModalVisible(false);
      fetchProviders();
    } catch (error) {
      message.error('프로바이더 저장에 실패했습니다.');
    }
  };

  const getStatusConfig = (status: ProviderStatus) => {
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
      case 'ERROR':
        return {
          color: 'error',
          icon: <ExclamationCircleOutlined />,
          text: '오류',
          className: 'status-error',
        };
      case 'CONNECTING':
        return {
          color: 'processing',
          icon: <ClockCircleOutlined />,
          text: '연결 중',
          className: 'status-connecting',
        };
      default:
        return {
          color: 'default',
          icon: <CloudOutlined />,
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
      title: '프로바이더',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CloudProvider) => (
        <div className="provider-cell">
          <div className="provider-icon-wrapper">{getProviderIcon(record.type)}</div>
          <div className="provider-info">
            <div className="provider-name">{text}</div>
            <div className="provider-type">{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProviderStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className={`status-tag ${config.className}`}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '리전',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => (
        <div className="region-cell">
          <Text type="secondary">{region || '-'}</Text>
        </div>
      ),
    },
    {
      title: '리소스',
      key: 'resources',
      render: (record: CloudProvider) => {
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
      render: (record: CloudProvider) => (
        <div className="actions-cell">
          <Space>
            <Tooltip title="동기화">
              <Button
                type="text"
                icon={<SyncOutlined />}
                onClick={() => fetchProviders()}
                className="action-btn sync-btn"
              />
            </Tooltip>
            <Tooltip title="상세 보기">
              <Button type="text" icon={<EyeOutlined />} className="action-btn view-btn" />
            </Tooltip>
            <Tooltip title="편집">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEditProvider(record)}
                className="action-btn edit-btn"
              />
            </Tooltip>
            <Tooltip title="설정">
              <Button type="text" icon={<SettingOutlined />} className="action-btn settings-btn" />
            </Tooltip>
            <Popconfirm
              title="이 프로바이더를 삭제하시겠습니까?"
              onConfirm={() => handleDeleteProvider(record.id)}
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
    <div className="cloud-providers-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              클라우드 프로바이더
            </Title>
            <Text className="page-description">
              연결된 클라우드 프로바이더를 관리하고 모니터링합니다.
            </Text>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProvider}
              className="add-provider-btn"
              size="large"
            >
              프로바이더 추가
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-providers">
            <Statistic
              title="총 프로바이더"
              value={stats.totalProviders}
              prefix={<CloudOutlined />}
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card active-providers">
            <Statistic
              title="활성 프로바이더"
              value={stats.activeProviders}
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

      {/* 프로바이더 목록 */}
      <Card className="providers-card glass-card">
        <div className="card-header">
          <div className="card-title">
            <Title level={3} className="card-title-text">
              프로바이더 목록
            </Title>
            <Text className="card-description">
              총 {providers.length}개의 프로바이더가 연결되어 있습니다.
            </Text>
          </div>
          <div className="card-actions">
            <Button
              icon={<SyncOutlined />}
              onClick={fetchProviders}
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
            dataSource={providers}
            loading={loading}
            rowKey="id"
            className="providers-table"
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

      {/* 프로바이더 추가/편집 모달 */}
      <Modal
        title={
          <div className="modal-title">
            <div className="modal-title-icon">
              {editingProvider ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <div className="modal-title-text">
              {editingProvider ? '프로바이더 편집' : '프로바이더 추가'}
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
        className="provider-modal"
        okText="저장"
        cancelText="취소"
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit} className="provider-form">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="프로바이더 이름"
                rules={[{ required: true, message: '프로바이더 이름을 입력해주세요.' }]}
              >
                <Input placeholder="예: Production AWS" prefix={<CloudOutlined />} size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="type"
                label="프로바이더 타입"
                rules={[{ required: true, message: '프로바이더 타입을 선택해주세요.' }]}
              >
                <Select placeholder="프로바이더 타입을 선택하세요" size="large">
                  <Option value="AWS">
                    <div className="provider-option">
                      <ThunderboltOutlined className="aws-icon" />
                      <span>Amazon Web Services</span>
                    </div>
                  </Option>
                  <Option value="GCP">
                    <div className="provider-option">
                      <DatabaseOutlined className="gcp-icon" />
                      <span>Google Cloud Platform</span>
                    </div>
                  </Option>
                  <Option value="AZURE">
                    <div className="provider-option">
                      <CloudOutlined className="azure-icon" />
                      <span>Microsoft Azure</span>
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="region"
                label="기본 리전"
                rules={[{ required: true, message: '기본 리전을 입력해주세요.' }]}
              >
                <Input placeholder="예: us-east-1, asia-northeast-1" size="large" />
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

export default CloudProvidersPage;
