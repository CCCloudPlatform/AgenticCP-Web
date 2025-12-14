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
import './EC2CreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const EC2CreatePage: React.FC = () => {
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
      console.log('EC2 생성 데이터:', values);
      // TODO: Implement EC2 creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('EC2 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      'web-server': {
        instanceName: 'web-server-' + Date.now(),
        instanceType: 't3.micro',
        keyPair: 'my-key-pair',
        enableMonitoring: true,
      },
      database: {
        instanceName: 'database-' + Date.now(),
        instanceType: 't3.small',
        keyPair: 'my-key-pair',
        enableMonitoring: true,
      },
      development: {
        instanceName: 'dev-server-' + Date.now(),
        instanceType: 't2.micro',
        keyPair: 'my-key-pair',
        enableMonitoring: false,
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const instanceTypes = [
    { value: 't2.micro', label: 't2.micro - 1 vCPU, 1 GB RAM', price: 'Free Tier' },
    { value: 't2.small', label: 't2.small - 1 vCPU, 2 GB RAM', price: '$0.023/hour' },
    { value: 't3.micro', label: 't3.micro - 2 vCPU, 1 GB RAM', price: '$0.0104/hour' },
    { value: 't3.small', label: 't3.small - 2 vCPU, 2 GB RAM', price: '$0.0208/hour' },
    { value: 't3.medium', label: 't3.medium - 2 vCPU, 4 GB RAM', price: '$0.0416/hour' },
  ];

  const amiOptions = [
    { value: 'ami-0abcdef1234567890', label: 'Amazon Linux 2 AMI (HVM) - Kernel 5.10' },
    { value: 'ami-0fedcba9876543210', label: 'Ubuntu Server 20.04 LTS (HVM)' },
    { value: 'ami-0123456789abcdef0', label: 'Windows Server 2019 Base' },
    { value: 'ami-0ubuntu20230412', label: 'Ubuntu Server 22.04 LTS' },
    { value: 'ami-0c02fb55956c7d155', label: 'Amazon Linux 2023' },
  ];

  const securityGroups = [
    { value: 'sg-12345678', label: 'default (SSH, HTTP, HTTPS)', description: '기본 보안 그룹' },
    { value: 'sg-87654321', label: 'web-server (HTTP, HTTPS)', description: '웹 서버용' },
    { value: 'sg-11223344', label: 'database (MySQL, PostgreSQL)', description: '데이터베이스용' },
    { value: 'sg-55667788', label: 'development (SSH)', description: '개발용' },
  ];

  // 기존 리소스들 (실제로는 API에서 가져올 데이터)
  const existingVPCs = [
    { value: 'vpc-12345678', label: 'default (10.0.0.0/16)', description: '기본 VPC' },
    { value: 'vpc-87654321', label: 'production (172.16.0.0/16)', description: '프로덕션 VPC' },
    { value: 'vpc-11223344', label: 'development (192.168.0.0/16)', description: '개발 VPC' },
  ];

  const existingSubnets = [
    { value: 'subnet-12345678', label: 'public-subnet-1a (10.0.1.0/24)', vpc: 'default' },
    { value: 'subnet-87654321', label: 'private-subnet-1a (10.0.2.0/24)', vpc: 'default' },
    { value: 'subnet-11223344', label: 'public-subnet-1b (10.0.3.0/24)', vpc: 'default' },
  ];

  const existingStorage = [
    { value: 'vol-12345678', label: 'gp3-8gb', description: '8GB GP3 볼륨' },
    { value: 'vol-87654321', label: 'gp3-20gb', description: '20GB GP3 볼륨' },
    { value: 'vol-11223344', label: 'gp2-50gb', description: '50GB GP2 볼륨' },
  ];

  return (
    <div className="ec2-create-page">
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
              AWS EC2 인스턴스 생성
            </Title>
            <Text className="page-description">
              간단하고 빠르게 EC2 인스턴스를 생성하세요. 모든 네트워크와 스토리지 설정은 자동으로
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
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 EC2를 생성하세요</Text>
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
          className="ec2-create-form"
          requiredMark={false}
          initialValues={{
            instanceType: 't3.micro',
            keyPair: 'my-key-pair',
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
                  <Input placeholder="my-ec2-instance" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="instanceType" label="인스턴스 타입">
                  <Select placeholder="인스턴스 타입을 선택하세요" size="large">
                    {instanceTypes.map((type) => (
                      <Option key={type.value} value={type.value}>
                        <div className="instance-option">
                          <div className="instance-info">
                            <span className="instance-name">{type.label}</span>
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
                <Form.Item name="ami" label="AMI (Amazon Machine Image)">
                  <Select placeholder="AMI를 선택하세요" size="large">
                    {amiOptions.map((ami) => (
                      <Option key={ami.value} value={ami.value}>
                        {ami.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="securityGroups" label="보안 그룹">
                  <Select mode="multiple" placeholder="보안 그룹을 선택하세요" size="large">
                    {securityGroups.map((sg) => (
                      <Option key={sg.value} value={sg.value}>
                        <div className="security-group-option">
                          <span className="sg-name">{sg.label}</span>
                          <span className="sg-desc">{sg.description}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="keyPair" label="키 페어">
                  <Select placeholder="키 페어를 선택하세요" size="large">
                    <Option value="my-key-pair">my-key-pair</Option>
                    <Option value="production-key">production-key</Option>
                    <Option value="development-key">development-key</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enableMonitoring" label="상세 모니터링" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 네트워크 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 네트워크 설정</Title>
              <Text type="secondary">기존 VPC와 서브넷을 선택하거나 새로 생성할 수 있습니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="vpc" label="VPC">
                  <Select placeholder="VPC를 선택하세요" size="large">
                    {existingVPCs.map((vpc) => (
                      <Option key={vpc.value} value={vpc.value}>
                        <div className="vpc-option">
                          <span className="vpc-name">{vpc.label}</span>
                          <span className="vpc-desc">{vpc.description}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="subnet" label="서브넷">
                  <Select placeholder="서브넷을 선택하세요" size="large">
                    {existingSubnets.map((subnet) => (
                      <Option key={subnet.value} value={subnet.value}>
                        <div className="subnet-option">
                          <span className="subnet-name">{subnet.label}</span>
                          <span className="subnet-vpc">VPC: {subnet.vpc}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 스토리지 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>💾 스토리지 설정</Title>
              <Text type="secondary">기존 스토리지를 선택하거나 새로 생성할 수 있습니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="storage" label="기존 스토리지 (선택사항)">
                  <Select placeholder="기존 스토리지를 선택하세요" size="large" allowClear>
                    {existingStorage.map((storage) => (
                      <Option key={storage.value} value={storage.value}>
                        <div className="storage-option">
                          <span className="storage-name">{storage.label}</span>
                          <span className="storage-desc">{storage.description}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="volumeSize" label="새 볼륨 크기 (GB)">
                  <Input placeholder="8" size="large" />
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
                href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🔒</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">보안 그룹</div>
                  <div className="guide-item-desc">
                    여러 보안 그룹을 선택하여 포트 규칙을 설정할 수 있습니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html"
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
                href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">💾</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">스토리지</div>
                  <div className="guide-item-desc">
                    기존 볼륨을 연결하거나 새로운 볼륨을 생성할 수 있습니다
                  </div>
                </div>
                <div className="guide-item-arrow">→</div>
              </a>
              <a
                href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html"
                target="_blank"
                rel="noopener noreferrer"
                className="guide-item"
              >
                <div className="guide-item-icon">🖥️</div>
                <div className="guide-item-content">
                  <div className="guide-item-title">AMI</div>
                  <div className="guide-item-desc">
                    Amazon Linux, Ubuntu, Windows 등 다양한 운영체제를 선택할 수 있습니다
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
                EC2 인스턴스 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EC2CreatePage;
