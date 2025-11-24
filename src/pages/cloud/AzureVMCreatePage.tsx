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
import './AzureVMCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const AzureVMCreatePage: React.FC = () => {
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
      console.log('Azure VM 생성 데이터:', values);
      // TODO: Implement Azure VM creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Azure VM 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      'web-server': {
        instanceName: 'web-server-' + Date.now(),
        vmSize: 'Standard_B1s',
        keyPair: 'my-azure-key',
        enableMonitoring: true,
      },
      database: {
        instanceName: 'database-' + Date.now(),
        vmSize: 'Standard_B2s',
        keyPair: 'my-azure-key',
        enableMonitoring: true,
      },
      development: {
        instanceName: 'dev-server-' + Date.now(),
        vmSize: 'Standard_B1s',
        keyPair: 'my-azure-key',
        enableMonitoring: false,
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const vmSizes = [
    { value: 'Standard_B1s', label: 'Standard_B1s - 1 vCPU, 1 GB RAM', price: '$0.005/hour' },
    { value: 'Standard_B2s', label: 'Standard_B2s - 2 vCPU, 4 GB RAM', price: '$0.010/hour' },
    { value: 'Standard_B1ms', label: 'Standard_B1ms - 1 vCPU, 2 GB RAM', price: '$0.010/hour' },
    { value: 'Standard_D2s_v3', label: 'Standard_D2s_v3 - 2 vCPU, 8 GB RAM', price: '$0.096/hour' },
  ];

  const imageOptions = [
    { value: 'UbuntuServer:20_04-lts:latest', label: 'Ubuntu Server 20.04 LTS' },
    { value: 'UbuntuServer:22_04-lts:latest', label: 'Ubuntu Server 22.04 LTS' },
    { value: 'Debian:debian-11:11', label: 'Debian 11' },
    { value: 'CentOS:centos-7:7.9', label: 'CentOS 7.9' },
    { value: 'WindowsServer:2019-Datacenter:latest', label: 'Windows Server 2019' },
  ];

  const networks = [
    {
      value: 'default-vnet',
      label: 'default-vnet (10.0.0.0/16)',
      description: '기본 가상 네트워크',
    },
    {
      value: 'production-vnet',
      label: 'production-vnet (172.16.0.0/16)',
      description: '프로덕션 가상 네트워크',
    },
    {
      value: 'development-vnet',
      label: 'development-vnet (192.168.0.0/16)',
      description: '개발 가상 네트워크',
    },
  ];

  const subnets = [
    { value: 'default-subnet', label: 'default-subnet (10.0.1.0/24)', vnet: 'default-vnet' },
    { value: 'prod-subnet', label: 'prod-subnet (172.16.1.0/24)', vnet: 'production-vnet' },
    { value: 'dev-subnet', label: 'dev-subnet (192.168.1.0/24)', vnet: 'development-vnet' },
  ];

  return (
    <div className="azure-vm-create-page">
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
              Azure VM 인스턴스 생성
            </Title>
            <Text className="page-description">
              Microsoft Azure VM 인스턴스를 생성하세요. 모든 네트워크와 스토리지 설정은 자동으로
              구성됩니다.
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
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 Azure VM을 생성하세요</Text>
        </div>
        <div className="quick-create-templates">
          <Space size="large">
            <Button
              size="large"
              onClick={() => handleQuickCreate('web-server')}
              className={`template-btn web-server ${selectedTemplate === 'web-server' ? 'selected' : ''}`}
            >
              🌐 웹 서버
              <div className="template-desc">IIS/Apache + PHP/Node.js</div>
            </Button>
            <Button
              size="large"
              onClick={() => handleQuickCreate('database')}
              className={`template-btn database ${selectedTemplate === 'database' ? 'selected' : ''}`}
            >
              🗄️ 데이터베이스
              <div className="template-desc">SQL Server/MySQL</div>
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
          className="azure-vm-create-form"
          requiredMark={false}
          initialValues={{
            vmSize: 'Standard_B1s',
            image: 'UbuntuServer:22_04-lts:latest',
            keyPair: 'my-azure-key',
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
                  <Input placeholder="my-azure-vm" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vmSize" label="VM 크기">
                  <Select placeholder="VM 크기를 선택하세요" size="large">
                    {vmSizes.map((size) => (
                      <Option key={size.value} value={size.value}>
                        <div className="vm-option">
                          <div className="vm-info">
                            <span className="vm-name">{size.label}</span>
                            <Tag color="blue" className="price-tag">
                              <DollarOutlined /> {size.price}
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
                    <Option value="my-azure-key">my-azure-key</Option>
                    <Option value="production-key">production-key</Option>
                    <Option value="development-key">development-key</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="enableMonitoring" label="모니터링" valuePropName="checked">
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 네트워크 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 네트워크 설정</Title>
              <Text type="secondary">기존 가상 네트워크와 서브넷을 선택할 수 있습니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="vnet" label="가상 네트워크">
                  <Select placeholder="가상 네트워크를 선택하세요" size="large">
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
                          <span className="subnet-vnet">VNet: {subnet.vnet}</span>
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
                href="https://learn.microsoft.com/en-us/azure/virtual-network/network-security-groups-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🛡️</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">네트워크 보안 그룹</div>
                  <div className="guide-item-desc">
                    HTTP(80), HTTPS(443), SSH(22) 포트가 자동으로 허용됩니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🌐</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">네트워크</div>
                  <div className="guide-item-desc">
                    기존 가상 네트워크와 서브넷을 선택하거나 기본값을 사용할 수 있습니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">💾</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">스토리지</div>
                  <div className="guide-item-desc">30GB OS 디스크가 자동으로 생성됩니다</div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://learn.microsoft.com/en-us/azure/virtual-machines/linux/imaging"
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
                Azure VM 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AzureVMCreatePage;
