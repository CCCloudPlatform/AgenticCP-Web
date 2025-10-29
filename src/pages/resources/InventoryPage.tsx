import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Badge,
  Tooltip,
  Empty,
} from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  CloudOutlined,
  CheckCircleOutlined,
  StopOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { Resource, ProviderType, ResourceStatus, CloudProvider } from '@/types';
import { cloudService } from '@/services/cloudService';
import { formatDate } from '@/utils/format';
import './InventoryPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface FilterState {
  providerId?: number; // 프로바이더 인스턴스 ID
  status?: ResourceStatus;
  search?: string;
}

const InventoryPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchResources();
    fetchProviders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [resources, filters]);

  const fetchProviders = async () => {
    try {
      const response = await cloudService.getProviders();
      setProviders(response.content || []);
    } catch (error) {
      console.error('프로바이더 목록 조회 실패:', error);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await cloudService.getResources({
        page: pagination.current - 1,
        size: pagination.pageSize,
      });
      setResources(response.content);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      console.error('리소스 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...resources];

    // Provider ID filter
    if (filters.providerId) {
      filtered = filtered.filter((r) => r.providerId === filters.providerId);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.type.toLowerCase().includes(searchLower) ||
          r.region.toLowerCase().includes(searchLower) ||
          Object.values(r.tags).some((tag) =>
            tag.toLowerCase().includes(searchLower)
          )
      );
    }

    setFilteredResources(filtered);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleProviderFilter = (value: number | undefined) => {
    setFilters((prev) => ({ ...prev, providerId: value }));
  };

  const handleStatusFilter = (value: ResourceStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getStatusConfig = (status: ResourceStatus) => {
    switch (status) {
      case 'RUNNING':
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          text: '실행 중',
          className: 'status-running',
        };
      case 'STOPPED':
        return {
          color: 'default',
          icon: <StopOutlined />,
          text: '중지됨',
          className: 'status-stopped',
        };
      case 'TERMINATED':
        return {
          color: 'default',
          icon: <CloseCircleOutlined />,
          text: '종료됨',
          className: 'status-terminated',
        };
      case 'ERROR':
        return {
          color: 'error',
          icon: <ExclamationCircleOutlined />,
          text: '오류',
          className: 'status-error',
        };
      default:
        return {
          color: 'default',
          icon: <CheckCircleOutlined />,
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

  const getTypeIcon = (type: string) => {
    if (type.includes('EC2') || type.includes('Compute') || type.includes('VM')) {
      return <ThunderboltOutlined className="type-icon" />;
    }
    if (type.includes('RDS') || type.includes('SQL') || type.includes('Database')) {
      return <DatabaseOutlined className="type-icon" />;
    }
    return <CloudOutlined className="type-icon" />;
  };

  // 통계 계산
  const getStats = () => {
    const totalResources = resources.length;
    const runningResources = resources.filter((r) => r.status === 'RUNNING').length;
    const stoppedResources = resources.filter((r) => r.status === 'STOPPED').length;
    const errorResources = resources.filter((r) => r.status === 'ERROR').length;

    return {
      totalResources,
      runningResources,
      stoppedResources,
      errorResources,
    };
  };

  const stats = getStats();

  const columns = [
    {
      title: '리소스',
      key: 'resource',
      render: (record: Resource) => (
        <div className="resource-cell">
          <div className="resource-icon-wrapper">
            {getTypeIcon(record.type)}
          </div>
          <div className="resource-info">
            <div className="resource-name">{record.name}</div>
            <div className="resource-type">{record.type}</div>
          </div>
        </div>
      ),
    },
    {
      title: '프로바이더',
      key: 'provider',
      render: (record: Resource) => {
        const providerInstance = providers.find((p) => p.id === record.providerId);
        return (
          <div className="provider-cell">
            <div className="provider-icon-wrapper">
              {getProviderIcon(record.provider)}
            </div>
            <div className="provider-info">
              <div className="provider-name">
                {providerInstance?.name || record.provider}
              </div>
              <div className="provider-region">{record.region}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: ResourceStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} className={`status-tag ${config.className}`}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '태그',
      key: 'tags',
      render: (record: Resource) => (
        <div className="tags-cell">
          {Object.entries(record.tags).slice(0, 2).map(([key, value]) => (
            <Tag key={key} className="resource-tag">
              {key}: {value}
            </Tag>
          ))}
          {Object.keys(record.tags).length > 2 && (
            <Tooltip
              title={
                <div>
                  {Object.entries(record.tags).slice(2).map(([key, value]) => (
                    <div key={key}>
                      {key}: {value}
                    </div>
                  ))}
                </div>
              }
            >
              <Tag className="resource-tag-more">
                +{Object.keys(record.tags).length - 2}
              </Tag>
            </Tooltip>
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
          <Text type="secondary">{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: '업데이트',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <div className="date-cell">
          <Text type="secondary">{formatDate(date)}</Text>
        </div>
      ),
    },
  ];

  const hasActiveFilters = Boolean(filters.providerId || filters.status || filters.search);

  return (
    <div className="inventory-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              리소스 인벤토리
            </Title>
            <Text className="page-description">
              멀티 클라우드 환경의 모든 리소스를 중앙에서 통합 관리합니다.
            </Text>
          </div>
          <div className="header-actions">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchResources}
              loading={loading}
              className="refresh-btn"
              size="large"
            >
              새로고침
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card total-resources">
            <Statistic
              title="총 리소스"
              value={stats.totalResources}
              prefix={<CloudOutlined />}
              valueStyle={{ color: 'var(--color-primary)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card running-resources">
            <Statistic
              title="실행 중"
              value={stats.runningResources}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: 'var(--color-success)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stopped-resources">
            <Statistic
              title="중지됨"
              value={stats.stoppedResources}
              prefix={<StopOutlined />}
              valueStyle={{ color: 'var(--color-gray-500)' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card error-resources">
            <Statistic
              title="오류"
              value={stats.errorResources}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: 'var(--color-error)' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 필터 및 검색 */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="리소스 이름, 타입, 리전, 태그 검색..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch('');
                }
              }}
              className="search-input"
            />
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Select
              placeholder="프로바이더"
              allowClear
              size="large"
              onChange={handleProviderFilter}
              value={filters.providerId}
              className="filter-select"
              showSearch
              filterOption={(input, option) => {
                const provider = providers.find((p) => p.id === option?.value);
                return provider?.name.toLowerCase().includes(input.toLowerCase()) || false;
              }}
            >
              {providers.map((provider) => (
                <Option key={provider.id} value={provider.id}>
                  <div className="provider-option">
                    {getProviderIcon(provider.type)}
                    <span>{provider.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="상태"
              allowClear
              size="large"
              onChange={handleStatusFilter}
              value={filters.status}
              className="filter-select"
            >
              <Option value="RUNNING">실행 중</Option>
              <Option value="STOPPED">중지됨</Option>
              <Option value="TERMINATED">종료됨</Option>
              <Option value="ERROR">오류</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              {hasActiveFilters && (
                <Button
                  icon={<FilterOutlined />}
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  필터 초기화
                </Button>
              )}
              <Badge
                count={Object.keys(filters).filter((key) => filters[key as keyof FilterState]).length}
                showZero={false}
                offset={[10, 0]}
              >
                <span></span>
              </Badge>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 리소스 목록 */}
      <Card className="resources-card glass-card">
        <div className="card-header">
          <div className="card-title">
            <Title level={3} className="card-title-text">
              리소스 목록
            </Title>
            <Text className="card-description">
              {hasActiveFilters
                ? `${filteredResources.length}개의 리소스가 표시됩니다.`
                : `총 ${resources.length}개의 리소스가 등록되어 있습니다.`}
            </Text>
          </div>
        </div>

        <div className="table-container">
          {filteredResources.length === 0 && !loading ? (
            <Empty
              description="리소스가 없습니다"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="empty-state"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredResources}
              loading={loading}
              rowKey="id"
              className="resources-table"
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
                className: 'table-pagination',
                onChange: (page, pageSize) => {
                  setPagination({ current: page, pageSize, total: pagination.total });
                },
              }}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default InventoryPage;

