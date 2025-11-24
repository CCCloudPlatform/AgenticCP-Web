import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Switch,
  Alert,
} from 'antd';
import { ArrowLeftOutlined, GlobalOutlined, ProjectOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import './GCPVPCCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const GCPVPCCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    const projectName = searchParams.get('projectName');

    if (projectId && projectName) {
      setProjectInfo({
        id: projectId,
        name: decodeURIComponent(projectName),
      });
    }
  }, [searchParams]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log('GCP VPC 생성 데이터:', values);
      // TODO: Implement GCP VPC creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('GCP VPC 생성 실패:', error);
    }
  };

  const ipRanges = [
    { value: '10.0.0.0/16', label: '10.0.0.0/16 (65,536 IPs)', recommended: true },
    { value: '172.16.0.0/16', label: '172.16.0.0/16 (65,536 IPs)', recommended: false },
    { value: '192.168.0.0/16', label: '192.168.0.0/16 (65,536 IPs)', recommended: false },
  ];

  const regions = [
    { value: 'us-central1', label: 'us-central1 (Iowa)' },
    { value: 'us-east1', label: 'us-east1 (South Carolina)' },
    { value: 'us-west1', label: 'us-west1 (Oregon)' },
    { value: 'europe-west1', label: 'europe-west1 (Belgium)' },
    { value: 'asia-northeast1', label: 'asia-northeast1 (Tokyo)' },
    { value: 'asia-southeast1', label: 'asia-southeast1 (Singapore)' },
  ];

  const routingModes = [
    {
      value: 'REGIONAL',
      label: 'Regional',
      description: '지역 내 최적화',
    },
    {
      value: 'GLOBAL',
      label: 'Global',
      description: '전 세계 최적화',
    },
  ];

  return (
    <div className="gcp-vpc-create-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/cloud/project-selection')}
              className="back-button"
            >
              프로젝트 선택으로 돌아가기
            </Button>
            <Title level={1} className="page-title">
              <GlobalOutlined className="title-icon" />
              GCP VPC 네트워크 생성
            </Title>
            <Text className="page-description">
              Google Cloud VPC 네트워크를 생성하고 서브넷을 구성합니다.
            </Text>
          </div>
        </div>
      </div>

      {/* 프로젝트 정보 */}
      {projectInfo && (
        <Alert
          message={
            <div className="project-info">
              <ProjectOutlined className="project-icon" />
              <span className="project-label">프로젝트:</span>
              <span className="project-name">{projectInfo.name}</span>
            </div>
          }
          type="info"
          showIcon={false}
          className="project-alert"
        />
      )}

      {/* 생성 폼 */}
      <Card className="create-form-card">
        <div className="form-header">
          <Title level={3}>⚙️ VPC 네트워크 설정</Title>
          <Text type="secondary">GCP VPC 네트워크의 기본 설정을 구성하세요</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="gcp-vpc-create-form"
          requiredMark={false}
          initialValues={{
            ipRange: '10.0.0.0/16',
            routingMode: 'REGIONAL',
            enableFlowLogs: false,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="networkName"
                  label="네트워크 이름"
                  rules={[{ required: true, message: '네트워크 이름을 입력해주세요.' }]}
                >
                  <Input placeholder="my-gcp-network" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="ipRange"
                  label="IPv4 범위"
                  rules={[{ required: true, message: 'IPv4 범위를 선택해주세요.' }]}
                >
                  <Select placeholder="IPv4 범위를 선택하세요" size="large">
                    {ipRanges.map((range) => (
                      <Option key={range.value} value={range.value}>
                        <div className="ip-range-option">
                          <span className="range-label">{range.label}</span>
                          {range.recommended && (
                            <Tag color="green" className="recommended-tag">
                              추천
                            </Tag>
                          )}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="region"
                  label="리전"
                  rules={[{ required: true, message: '리전을 선택해주세요.' }]}
                >
                  <Select placeholder="리전을 선택하세요" size="large">
                    {regions.map((region) => (
                      <Option key={region.value} value={region.value}>
                        {region.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="description" label="설명 (선택사항)">
                  <Input placeholder="네트워크에 대한 설명" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 라우팅 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🛣️ 라우팅 설정</Title>
              <Text type="secondary">VPC 네트워크의 라우팅 모드를 설정합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  name="routingMode"
                  label="라우팅 모드"
                  rules={[{ required: true, message: '라우팅 모드를 선택해주세요.' }]}
                >
                  <Select placeholder="라우팅 모드를 하세요" size="large">
                    {routingModes.map((mode) => (
                      <Option key={mode.value} value={mode.value}>
                        <div className="routing-option">{mode.label}</div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 서브넷 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 서브넷 설정</Title>
              <Text type="secondary">VPC 내의 서브넷을 구성합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="enableSubnet"
                  label="서브넷 생성"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enablePrivateGoogleAccess"
                  label="Private Google Access"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="subnetName" label="서브넷 이름" initialValue="default-subnet">
                  <Input placeholder="my-subnet" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="subnetRange" label="서브넷 범위" initialValue="10.0.1.0/24">
                  <Input placeholder="10.0.1.0/24" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 보안 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🔒 보안 설정</Title>
              <Text type="secondary">VPC 네트워크의 보안 구성을 설정합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="enableFlowLogs"
                  label="VPC Flow Logs 활성화"
                  valuePropName="checked"
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enableFirewall"
                  label="방화벽 규칙 생성"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 설정 안내 */}
          <div className="auto-config-info">
            <div className="info-card">
              <Title level={4}>💡 설정 가이드</Title>
              <Text type="secondary">다음 설정들을 참고하여 구성하세요:</Text>
              <ul>
                <li>
                  <strong>IPv4 범위:</strong> VPC 네트워크의 IP 주소 범위를 정의합니다
                </li>
                <li>
                  <strong>라우팅 모드:</strong> Regional은 지역 내 최적화, Global은 전 세계 최적화
                </li>
                <li>
                  <strong>Private Google Access:</strong> Google API에 대한 프라이빗 액세스를
                  제공합니다
                </li>
                <li>
                  <strong>VPC Flow Logs:</strong> 네트워크 트래픽 모니터링을 위해 활성화하세요
                </li>
              </ul>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <Space>
              <Button size="large" onClick={() => navigate(ROUTES.RESOURCES)}>
                취소
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="create-button"
              >
                GCP VPC 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default GCPVPCCreatePage;
