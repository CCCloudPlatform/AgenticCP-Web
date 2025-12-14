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
import {
  ArrowLeftOutlined,
  CloudServerOutlined,
  DollarOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import './GCPVMCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const GCPVMCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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
      console.log('GCP VM 생성 데이터:', values);
      // TODO: Implement GCP VM creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('GCP VM 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      'web-server': {
        instanceName: 'web-server-' + Date.now(),
        machineType: 'e2-micro',
        keyPair: 'my-gcp-key',
        enableMonitoring: true,
      },
      database: {
        instanceName: 'database-' + Date.now(),
        machineType: 'e2-small',
        keyPair: 'my-gcp-key',
        enableMonitoring: true,
      },
      development: {
        instanceName: 'dev-server-' + Date.now(),
        machineType: 'e2-micro',
        keyPair: 'my-gcp-key',
        enableMonitoring: false,
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const machineTypes = [
    { value: 'e2-micro', label: 'e2-micro - 2 vCPU, 1 GB RAM', price: 'Free Tier' },
    { value: 'e2-small', label: 'e2-small - 2 vCPU, 2 GB RAM', price: '$0.033/hour' },
    { value: 'e2-medium', label: 'e2-medium - 2 vCPU, 4 GB RAM', price: '$0.067/hour' },
    { value: 'e2-standard-2', label: 'e2-standard-2 - 2 vCPU, 8 GB RAM', price: '$0.134/hour' },
  ];

  const imageOptions = [
    { value: 'ubuntu-2004-lts', label: 'Ubuntu 20.04 LTS' },
    { value: 'ubuntu-2204-lts', label: 'Ubuntu 22.04 LTS' },
    { value: 'debian-11', label: 'Debian 11' },
    { value: 'centos-7', label: 'CentOS 7' },
    { value: 'windows-server-2019', label: 'Windows Server 2019' },
  ];

  const networks = [
    { value: 'default', label: 'default (10.128.0.0/9)', description: '기본 네트워크' },
    { value: 'production', label: 'production (172.16.0.0/16)', description: '프로덕션 네트워크' },
    { value: 'development', label: 'development (192.168.0.0/16)', description: '개발 네트워크' },
  ];

  const subnets = [
    { value: 'subnet-1', label: 'default-subnet (10.128.0.0/20)', network: 'default' },
    { value: 'subnet-2', label: 'prod-subnet (172.16.0.0/24)', network: 'production' },
    { value: 'subnet-3', label: 'dev-subnet (192.168.0.0/24)', network: 'development' },
  ];

  return (
    <div className="gcp-vm-create-page">
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
              <CloudServerOutlined className="title-icon" />
              GCP VM 인스턴스 생성
            </Title>
            <Text className="page-description">
              Google Cloud Platform VM 인스턴스를 생성하세요. 모든 네트워크와 스토리지 설정은
              자동으로 구성됩니다.
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

      {/* 퀵 생성 템플릿 */}
      <Card className="quick-create-card">
        <div className="quick-create-header">
          <Title level={3}>🚀 빠른 생성</Title>
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 GCP VM을 생성하세요</Text>
        </div>
        <div className="quick-create-templates">
          <Space size="large">
            <Button
              size="large"
              onClick={() => handleQuickCreate('web-server')}
              className={`template-btn web-server ${selectedTemplate === 'web-server' ? 'selected' : ''}`}
            >
              🌐 웹 서버
              <div className="template-desc">Apache/Nginx + PHP/Node.js</div>
            </Button>
            <Button
              size="large"
              onClick={() => handleQuickCreate('database')}
              className={`template-btn database ${selectedTemplate === 'database' ? 'selected' : ''}`}
            >
              🗄️ 데이터베이스
              <div className="template-desc">MySQL/PostgreSQL</div>
            </Button>
            <Button
              size="large"
              onClick={() => handleQuickCreate('development')}
              className={`template-btn development ${selectedTemplate === 'development' ? 'selected' : ''}`}
            >
              💻 개발 서버
              <div className="template-desc">개발/테스트용</div>
            </Button>
          </Space>
        </div>
      </Card>

      {/* 생성 폼 */}
      <Card className="create-form-card">
        <div className="form-header">
          <Title level={3}>⚙️ 상세 설정 (선택사항)</Title>
          <Text type="secondary">기본 설정을 변경하거나 추가 옵션을 설정할 수 있습니다</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="gcp-vm-create-form"
          requiredMark={false}
          initialValues={{
            machineType: 'e2-micro',
            image: 'ubuntu-2204-lts',
            keyPair: 'my-gcp-key',
            enableMonitoring: true,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="instanceName"
                  label="인스턴스 이름"
                  rules={[{ required: true, message: '인스턴스 이름을 입력해주세요.' }]}
                >
                  <Input placeholder="my-gcp-vm" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="machineType" label="머신 타입">
                  <Select placeholder="머신 타입을 선택하세요" size="large">
                    {machineTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        <div className="machine-option">
                          <div className="machine-info">
                            <span className="machine-name">{type.label}</span>
                            <Tag color="blue" className="price-tag">
                              <DollarOutlined /> {type.price}
                            </Tag>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="image" label="이미지">
                  <Select placeholder="이미지를 선택하세요" size="large">
                    {imageOptions.map((image) => (
                      <Option key={image.value} value={image.value}>
                        {image.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="keyPair" label="SSH 키">
                  <Select placeholder="SSH 키를 선택하세요" size="large">
                    <Option value="my-gcp-key">my-gcp-key</Option>
                    <Option value="production-key">production-key</Option>
                    <Option value="development-key">development-key</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="enableMonitoring" label="모니터링" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 네트워크 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 네트워크 설정</Title>
              <Text type="secondary">기존 네트워크와 서브넷을 선택할 수 있습니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="network" label="네트워크">
                  <Select placeholder="네트워크를 선택하세요" size="large">
                    {networks.map((network) => (
                      <Option key={network.value} value={network.value}>
                        <div className="network-option">
                          <span className="network-name">{network.label}</span>
                          <span className="network-desc">{network.description}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="subnet" label="서브넷">
                  <Select placeholder="서브넷을 선택하세요" size="large">
                    {subnets.map((subnet) => (
                      <Option key={subnet.value} value={subnet.value}>
                        <div className="subnet-option">
                          <span className="subnet-name">{subnet.label}</span>
                          <span className="subnet-network">Network: {subnet.network}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 설정 안내 */}
          <div className="config-guide">
            <div className="guide-header">
              <div className="guide-icon">💡</div>
              <div className="guide-title-section">
                <Title level={4} className="guide-title">
                  설정 가이드
                </Title>
                <Text type="secondary">리소스 구성 시 참고하세요</Text>
              </div>
            </div>
            <div className="guide-items">
              <a
                href="https://cloud.google.com/vpc/docs/firewalls"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🔥</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">방화벽 규칙</div>
                  <div className="guide-item-desc">
                    HTTP(80), HTTPS(443), SSH(22) 포트가 자동으로 허용됩니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://cloud.google.com/vpc/docs/vpc"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🌐</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">네트워크</div>
                  <div className="guide-item-desc">
                    기존 VPC와 서브넷을 선택하거나 기본값을 사용할 수 있습니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://cloud.google.com/compute/docs/disks"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">💾</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">스토리지</div>
                  <div className="guide-item-desc">10GB 부트 디스크가 자동으로 생성됩니다</div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://cloud.google.com/compute/docs/images"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🖥️</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">이미지</div>
                  <div className="guide-item-desc">
                    Ubuntu, Debian, CentOS, Windows 등 다양한 운영체제를 선택할 수 있습니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
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
                GCP VM 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default GCPVMCreatePage;
