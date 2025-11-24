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
import './AzureVNetCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const AzureVNetCreatePage: React.FC = () => {
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
      console.log('Azure VNet 생성 데이터:', values);
      // TODO: Implement Azure VNet creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Azure VNet 생성 실패:', error);
    }
  };

  const addressSpaces = [
    { value: '10.0.0.0/16', label: '10.0.0.0/16 (65,536 IPs)', recommended: true },
    { value: '172.16.0.0/16', label: '172.16.0.0/16 (65,536 IPs)', recommended: false },
    { value: '192.168.0.0/16', label: '192.168.0.0/16 (65,536 IPs)', recommended: false },
  ];

  const regions = [
    { value: 'eastus', label: 'East US' },
    { value: 'eastus2', label: 'East US 2' },
    { value: 'westus', label: 'West US' },
    { value: 'westus2', label: 'West US 2' },
    { value: 'centralus', label: 'Central US' },
    { value: 'northeurope', label: 'North Europe' },
    { value: 'westeurope', label: 'West Europe' },
    { value: 'eastasia', label: 'East Asia' },
    { value: 'southeastasia', label: 'Southeast Asia' },
  ];

  const ddosProtectionTiers = [
    { value: 'Basic', label: 'Basic - 기본 DDoS 보호', price: '무료' },
    { value: 'Standard', label: 'Standard - 고급 DDoS 보호', price: '$2,944/월' },
  ];

  return (
    <div className="azure-vnet-create-page">
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
              Azure Virtual Network 생성
            </Title>
            <Text className="page-description">
              Microsoft Azure Virtual Network를 생성하고 서브넷을 구성합니다.
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
          <Title level={3}>⚙️ Virtual Network 설정</Title>
          <Text type="secondary">Azure VNet의 기본 설정을 구성하세요</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="azure-vnet-create-form"
          requiredMark={false}
          initialValues={{
            addressSpace: '10.0.0.0/16',
            ddosProtection: 'Basic',
            enableDnsServers: true,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="vnetName"
                  label="Virtual Network 이름"
                  rules={[{ required: true, message: 'VNet 이름을 입력해주세요.' }]}
                >
                  <Input placeholder="my-azure-vnet" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="addressSpace"
                  label="주소 공간"
                  rules={[{ required: true, message: '주소 공간을 선택해주세요.' }]}
                >
                  <Select placeholder="주소 공간을 선택하세요" size="large">
                    {addressSpaces.map((space) => (
                      <Option key={space.value} value={space.value}>
                        <div className="address-space-option">
                          <span className="space-label">{space.label}</span>
                          {space.recommended && (
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
                  <Input placeholder="VNet에 대한 설명" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 서브넷 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 서브넷 설정</Title>
              <Text type="secondary">VNet 내의 서브넷을 구성합니다</Text>
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
                  name="enableServiceEndpoints"
                  label="서비스 엔드포인트"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="subnetName" label="서브넷 이름" initialValue="default">
                  <Input placeholder="my-subnet" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="subnetAddressPrefix"
                  label="서브넷 주소 접두사"
                  initialValue="10.0.1.0/24"
                >
                  <Input placeholder="10.0.1.0/24" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 보안 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🔒 보안 설정</Title>
              <Text type="secondary">VNet의 보안 및 DDoS 보호를 설정합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="ddosProtection"
                  label="DDoS 보호 계층"
                  rules={[{ required: true, message: 'DDoS 보호 계층을 선택해주세요.' }]}
                >
                  <Select placeholder="DDoS 보호 계층을 선택하세요" size="large">
                    {ddosProtectionTiers.map((tier) => (
                      <Option key={tier.value} value={tier.value}>
                        <div className="ddos-option">
                          <div className="ddos-info">
                            <span className="ddos-name">{tier.label}</span>
                            <Tag color="blue" className="price-tag">
                              {tier.price}
                            </Tag>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enableDnsServers" label="DNS 서버 사용" valuePropName="checked">
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="enableNetworkSecurityGroup"
                  label="네트워크 보안 그룹"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enableFlowLogs"
                  label="NSG Flow Logs"
                  valuePropName="checked"
                  initialValue={false}
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
                  <strong>주소 공간:</strong> VNet의 IP 주소 범위를 정의합니다
                </li>
                <li>
                  <strong>서비스 엔드포인트:</strong> Azure 서비스에 대한 프라이빗 연결을 제공합니다
                </li>
                <li>
                  <strong>DDoS 보호:</strong> 네트워크 공격으로부터 보호합니다
                </li>
                <li>
                  <strong>네트워크 보안 그룹:</strong> 인바운드/아웃바운드 트래픽을 제어합니다
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
                Azure VNet 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AzureVNetCreatePage;
