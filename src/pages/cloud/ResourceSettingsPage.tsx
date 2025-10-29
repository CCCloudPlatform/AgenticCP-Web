import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Typography,
  Divider,
  Alert,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Resource } from '@/types';
import { mockResources } from '@/data/mockData';
import './ResourceSettingsPage.scss';

const { Title, Text } = Typography;

const ResourceSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResourceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const resourceId = searchParams.get('resourceId');

      if (resourceId) {
        // Mock: 실제로는 API 호출
        const foundResource = mockResources.find((r) => r.id === Number(resourceId));
        if (foundResource) {
          setResource(foundResource);
        }
      }
    } catch (error) {
      console.error('리소스 상세 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (resourceType: string) => {
    const type = resourceType.toLowerCase();
    if (['ec2', 'compute engine', 'virtual machine', 'vm'].includes(type)) {
      return <CloudServerOutlined />;
    }
    if (['s3', 'cloud storage', 'blob storage'].includes(type)) {
      return <DatabaseOutlined />;
    }
    if (['vpc', 'virtual network', 'vnet'].includes(type)) {
      return <GlobalOutlined />;
    }
    return <CloudServerOutlined />;
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

  if (!resource && !loading) {
    return (
      <div className="resource-settings-page">
        <Card>
          <div className="empty-state">
            <Title level={3}>리소스를 찾을 수 없습니다</Title>
            <Button type="primary" onClick={() => navigate(-1)} style={{ marginTop: '16px' }}>
              뒤로 가기
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="resource-settings-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="back-button">
          뒤로 가기
        </Button>
        <div className="header-content">
          <div className="title-section">
            <div className="resource-icon-large">{resource && getResourceIcon(resource.type)}</div>
            <div className="title-text">
              <Title level={2} className="page-title">
                {resource?.name}
              </Title>
              <Text type="secondary" className="page-description">
                {resource?.type} • {resource?.region}
              </Text>
            </div>
          </div>
          <div className="status-section">
            <Tag color={resource && getStatusColor(resource.status)} className="status-tag">
              {resource && getStatusText(resource.status)}
            </Tag>
          </div>
        </div>
      </div>

      {/* 리소스 통계 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="월 비용"
              value={resource?.cost || 0}
              prefix={<DollarOutlined />}
              suffix="USD"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="가동 시간"
              value={resource?.status === 'running' ? '24h' : '0h'}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="생성일"
              value={
                resource?.createdAt ? new Date(resource.createdAt).toLocaleDateString('ko-KR') : '-'
              }
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="리전"
              value={resource?.region || '-'}
              prefix={<EnvironmentOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 기본 정보 */}
      <Card className="info-card" title="기본 정보" loading={loading}>
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} bordered>
          <Descriptions.Item label="리소스 ID">{resource?.id}</Descriptions.Item>
          <Descriptions.Item label="리소스 이름">{resource?.name}</Descriptions.Item>
          <Descriptions.Item label="리소스 타입">{resource?.type}</Descriptions.Item>
          <Descriptions.Item label="상태">
            <Tag color={resource && getStatusColor(resource.status)}>
              {resource && getStatusText(resource.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="리전">{resource?.region}</Descriptions.Item>
          <Descriptions.Item label="월 비용">
            ${resource?.cost?.toLocaleString()} USD
          </Descriptions.Item>
          <Descriptions.Item label="생성일" span={3}>
            {resource?.createdAt ? new Date(resource.createdAt).toLocaleString('ko-KR') : '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 설정 정보 (읽기 전용) */}
      <Card className="settings-card" title="리소스 설정">
        <Alert
          message="설정 정보"
          description="리소스 설정 정보를 확인할 수 있습니다. 리소스 이름은 리소스 목록에서 직접 수정할 수 있습니다."
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label="자동 확장">
            <Tag color="default">비활성화</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="모니터링">
            <Tag color="green">활성화</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="자동 백업">
            <Tag color="green">활성화</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="인스턴스 타입">
            <Text>t3.medium</Text>
          </Descriptions.Item>
          <Descriptions.Item label="스토리지">
            <Text>100 GB (gp3)</Text>
          </Descriptions.Item>
          <Descriptions.Item label="네트워크">
            <Text>VPC-default</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div className="form-actions">
          <Button onClick={() => navigate(-1)} size="large" type="primary">
            목록으로 돌아가기
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResourceSettingsPage;
