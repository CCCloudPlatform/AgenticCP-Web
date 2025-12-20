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
import './GCPStorageCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const GCPStorageCreatePage: React.FC = () => {
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
      console.log('GCP Storage 생성 데이터:', values);
      // TODO: Implement GCP Storage creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('GCP Storage 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      website: {
        bucketName: 'website-' + Date.now(),
        storageClass: 'STANDARD',
        location: 'US',
        versioning: false,
      },
      backup: {
        bucketName: 'backup-' + Date.now(),
        storageClass: 'NEARLINE',
        location: 'US',
        versioning: true,
      },
      archive: {
        bucketName: 'archive-' + Date.now(),
        storageClass: 'COLDLINE',
        location: 'US',
        versioning: false,
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const storageClasses = [
    { value: 'STANDARD', label: 'Standard - 자주 액세스하는 데이터', price: '$0.020/GB/month' },
    { value: 'NEARLINE', label: 'Nearline - 월 1회 액세스', price: '$0.010/GB/month' },
    { value: 'COLDLINE', label: 'Coldline - 분기별 액세스', price: '$0.004/GB/month' },
    { value: 'ARCHIVE', label: 'Archive - 연간 액세스', price: '$0.0012/GB/month' },
  ];

  const locations = [
    { value: 'US', label: 'United States (us)' },
    { value: 'EU', label: 'Europe (eu)' },
    { value: 'ASIA', label: 'Asia (asia)' },
    { value: 'US-CENTRAL1', label: 'Iowa (us-central1)' },
    { value: 'US-EAST1', label: 'South Carolina (us-east1)' },
    { value: 'EUROPE-WEST1', label: 'Belgium (europe-west1)' },
    { value: 'ASIA-NORTHEAST1', label: 'Tokyo (asia-northeast1)' },
  ];

  return (
    <div className="gcp-storage-create-page">
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
              GCP Storage 버킷 생성
            </Title>
            <Text className="page-description">
              Google Cloud Storage 버킷을 생성하세요. 데이터 저장 및 관리에 최적화된 설정을
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
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 GCP Storage를 생성하세요</Text>
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
          className="gcp-storage-create-form"
          requiredMark={false}
          initialValues={{
            storageClass: 'STANDARD',
            location: 'US',
            versioning: false,
            publicAccess: false,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="bucketName"
                  label="버킷 이름"
                  rules={[
                    { required: true, message: '버킷 이름을 입력해주세요.' },
                    { min: 3, message: '버킷 이름은 최소 3자 이상이어야 합니다.' },
                    { max: 63, message: '버킷 이름은 최대 63자까지 가능합니다.' },
                    {
                      pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
                      message: '버킷 이름은 소문자, 숫자, 하이픈만 사용 가능합니다.',
                    },
                  ]}
                >
                  <Input placeholder="my-gcp-bucket" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="storageClass" label="스토리지 클래스">
                  <Select placeholder="스토리지 클래스를 선택하세요" size="large">
                    {storageClasses.map((storage) => (
                      <Option key={storage.value} value={storage.value}>
                        <div className="storage-option">
                          <div className="storage-info">
                            <span className="storage-name">{storage.label}</span>
                            <Tag color="blue" className="price-tag">
                              <DollarOutlined /> {storage.price}
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
                <Form.Item name="location" label="위치">
                  <Select placeholder="위치를 선택하세요" size="large">
                    {locations.map((location) => (
                      <Option key={location.value} value={location.value}>
                        {location.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="versioning" label="버전 관리" valuePropName="checked">
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 보안 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🔒 보안 설정</Title>
              <Text type="secondary">버킷의 보안 및 접근 권한을 설정합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="publicAccess" label="공개 액세스" valuePropName="checked">
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="encryption" label="암호화">
                  <Radio.Group size="large">
                    <Radio value="google-managed">Google 관리 키</Radio>
                    <Radio value="customer-managed">고객 관리 키</Radio>
                  </Radio.Group>
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
                  <strong>스토리지 클래스:</strong> 데이터 액세스 빈도에 따라 비용 최적화된 클래스를
                  선택하세요
                </li>
                <li>
                  <strong>위치:</strong> 데이터 주 사용 지역에 가까운 위치를 선택하여 성능을
                  향상시키세요
                </li>
                <li>
                  <strong>버전 관리:</strong> 파일 변경 이력을 추적하고 복원할 수 있습니다
                </li>
                <li>
                  <strong>보안:</strong> 공개 액세스 설정과 암호화 방식을 신중히 선택하세요
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
                GCP Storage 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default GCPStorageCreatePage;
