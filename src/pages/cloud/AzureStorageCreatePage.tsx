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
  Radio,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  DatabaseOutlined,
  DollarOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import './AzureStorageCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const AzureStorageCreatePage: React.FC = () => {
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
      console.log('Azure Storage 생성 데이터:', values);
      // TODO: Implement Azure Storage creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Azure Storage 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      website: {
        storageAccountName: 'website' + Date.now(),
        performance: 'Standard',
        replication: 'LRS',
        accessTier: 'Hot',
      },
      backup: {
        storageAccountName: 'backup' + Date.now(),
        performance: 'Standard',
        replication: 'GRS',
        accessTier: 'Cool',
      },
      archive: {
        storageAccountName: 'archive' + Date.now(),
        performance: 'Standard',
        replication: 'GRS',
        accessTier: 'Archive',
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const performanceTiers = [
    { value: 'Standard', label: 'Standard - 범용 스토리지', price: '$0.0184/GB/month' },
    { value: 'Premium', label: 'Premium - 고성능 SSD', price: '$0.15/GB/month' },
  ];

  const replicationTypes = [
    {
      value: 'LRS',
      label: 'LRS - 로컬 중복 스토리지',
      description: '단일 데이터센터 내 3개 복사본',
    },
    { value: 'GRS', label: 'GRS - 지역 중복 스토리지', description: '2개 지역에 6개 복사본' },
    {
      value: 'RA-GRS',
      label: 'RA-GRS - 읽기 액세스 지역 중복',
      description: '읽기 전용 보조 지역 포함',
    },
    { value: 'ZRS', label: 'ZRS - 영역 중복 스토리지', description: '단일 지역 내 3개 영역' },
  ];

  const accessTiers = [
    { value: 'Hot', label: 'Hot - 자주 액세스', price: '$0.0184/GB/month' },
    { value: 'Cool', label: 'Cool - 가끔 액세스', price: '$0.01/GB/month' },
    { value: 'Archive', label: 'Archive - 거의 액세스 안함', price: '$0.00099/GB/month' },
  ];

  const regions = [
    { value: 'eastus', label: 'East US' },
    { value: 'eastus2', label: 'East US 2' },
    { value: 'westus', label: 'West US' },
    { value: 'westus2', label: 'West US 2' },
    { value: 'centralus', label: 'Central US' },
    { value: 'northcentralus', label: 'North Central US' },
    { value: 'southcentralus', label: 'South Central US' },
    { value: 'westcentralus', label: 'West Central US' },
    { value: 'eastasia', label: 'East Asia' },
    { value: 'southeastasia', label: 'Southeast Asia' },
    { value: 'northeurope', label: 'North Europe' },
    { value: 'westeurope', label: 'West Europe' },
  ];

  return (
    <div className="azure-storage-create-page">
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
              <DatabaseOutlined className="title-icon" />
              Azure Storage 계정 생성
            </Title>
            <Text className="page-description">
              Microsoft Azure Storage 계정을 생성하세요. Blob, File, Queue, Table 스토리지를
              제공합니다.
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
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 Azure Storage를 생성하세요</Text>
        </div>
        <div className="quick-create-templates">
          <Space size="large">
            <Button
              size="large"
              onClick={() => handleQuickCreate('website')}
              className={`template-btn website ${selectedTemplate === 'website' ? 'selected' : ''}`}
            >
              🌐 웹사이트 스토리지
              <div className="template-desc">정적 웹사이트 호스팅</div>
            </Button>
            <Button
              size="large"
              onClick={() => handleQuickCreate('backup')}
              className={`template-btn backup ${selectedTemplate === 'backup' ? 'selected' : ''}`}
            >
              💾 백업 스토리지
              <div className="template-desc">데이터 백업 및 복원</div>
            </Button>
            <Button
              size="large"
              onClick={() => handleQuickCreate('archive')}
              className={`template-btn archive ${selectedTemplate === 'archive' ? 'selected' : ''}`}
            >
              📦 아카이브 스토리지
              <div className="template-desc">장기 보관 데이터</div>
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
          className="azure-storage-create-form"
          requiredMark={false}
          initialValues={{
            performance: 'Standard',
            replication: 'LRS',
            accessTier: 'Hot',
            region: 'eastus',
            httpsOnly: true,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="storageAccountName"
                  label="스토리지 계정 이름"
                  rules={[
                    { required: true, message: '스토리지 계정 이름을 입력해주세요.' },
                    { min: 3, message: '스토리지 계정 이름은 최소 3자 이상이어야 합니다.' },
                    { max: 24, message: '스토리지 계정 이름은 최대 24자까지 가능합니다.' },
                    {
                      pattern: /^[a-z0-9]+$/,
                      message: '스토리지 계정 이름은 소문자와 숫자만 사용 가능합니다.',
                    },
                  ]}
                >
                  <Input placeholder="mystorageaccount" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="performance" label="성능 계층">
                  <Select placeholder="성능 계층을 선택하세요" size="large">
                    {performanceTiers.map((tier) => (
                      <Option key={tier.value} value={tier.value}>
                        <div className="performance-option">
                          <div className="performance-info">
                            <span className="performance-name">{tier.label}</span>
                            <Tag color="blue" className="price-tag">
                              <DollarOutlined /> {tier.price}
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
                <Form.Item name="replication" label="복제 유형">
                  <Select placeholder="복제 유형을 선택하세요" size="large">
                    {replicationTypes.map((replication) => (
                      <Option key={replication.value} value={replication.value}>
                        <div className="replication-option">
                          <span className="replication-name">{replication.label}</span>
                          <span className="replication-desc">{replication.description}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="accessTier" label="액세스 계층">
                  <Select placeholder="액세스 계층을 선택하세요" size="large">
                    {accessTiers.map((tier) => (
                      <Option key={tier.value} value={tier.value}>
                        <div className="access-tier-option">
                          <div className="tier-info">
                            <span className="tier-name">{tier.label}</span>
                            <Tag color="green" className="price-tag">
                              <DollarOutlined /> {tier.price}
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
                <Form.Item name="region" label="지역">
                  <Select placeholder="지역을 선택하세요" size="large">
                    {regions.map((region) => (
                      <Option key={region.value} value={region.value}>
                        {region.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="httpsOnly" label="HTTPS 전용" valuePropName="checked">
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 보안 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🔒 보안 설정</Title>
              <Text type="secondary">스토리지 계정의 보안 및 암호화 설정</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="encryption" label="암호화">
                  <Radio.Group size="large">
                    <Radio value="microsoft-managed">Microsoft 관리 키</Radio>
                    <Radio value="customer-managed">고객 관리 키</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="allowBlobPublicAccess"
                  label="Blob 공개 액세스"
                  valuePropName="checked"
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
                  <strong>성능 계층:</strong> Standard는 범용 용도, Premium은 고성능 SSD
                  스토리지입니다
                </li>
                <li>
                  <strong>복제 유형:</strong> 데이터 중복성과 비용의 균형을 고려하여 선택하세요
                </li>
                <li>
                  <strong>액세스 계층:</strong> 데이터 액세스 빈도에 따라 비용을 최적화할 수
                  있습니다
                </li>
                <li>
                  <strong>보안:</strong> 민감한 데이터의 경우 고객 관리 키를 권장합니다
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
                Azure Storage 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AzureStorageCreatePage;
