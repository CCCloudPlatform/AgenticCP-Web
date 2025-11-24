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
  Divider,
  Tag,
  Switch,
  Radio,
  Alert,
} from 'antd';
import {
  ArrowLeftOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  CloudOutlined,
  LockOutlined,
  GlobalOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import './S3CreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const S3CreatePage: React.FC = () => {
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
      console.log('S3 생성 데이터:', values);
      // TODO: Implement S3 creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('S3 생성 실패:', error);
    }
  };

  const handleQuickCreate = (templateType: string) => {
    setSelectedTemplate(templateType);

    const quickTemplates = {
      website: {
        bucketName: 'website-' + Date.now(),
        storageClass: 'STANDARD',
        region: 'us-east-1',
        enableVersioning: false,
        blockPublicAccess: false,
        enableEncryption: true,
      },
      backup: {
        bucketName: 'backup-' + Date.now(),
        storageClass: 'STANDARD_IA',
        region: 'us-east-1',
        enableVersioning: true,
        blockPublicAccess: true,
        enableEncryption: true,
      },
      archive: {
        bucketName: 'archive-' + Date.now(),
        storageClass: 'GLACIER',
        region: 'us-east-1',
        enableVersioning: false,
        blockPublicAccess: true,
        enableEncryption: true,
      },
    };

    const templateData = quickTemplates[templateType as keyof typeof quickTemplates];
    if (templateData) {
      form.setFieldsValue(templateData);
    }
  };

  const storageClasses = [
    {
      value: 'STANDARD',
      label: 'Standard',
      description: '자주 액세스하는 데이터용',
      price: '$0.023/GB',
    },
    {
      value: 'STANDARD_IA',
      label: 'Standard-IA',
      description: '자주 액세스하지 않는 데이터용',
      price: '$0.0125/GB',
    },
    { value: 'GLACIER', label: 'Glacier', description: '장기 보관용', price: '$0.004/GB' },
    {
      value: 'GLACIER_IR',
      label: 'Glacier Instant Retrieval',
      description: '즉시 액세스 가능한 아카이브',
      price: '$0.004/GB',
    },
  ];

  const regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)', code: 'us-east-1' },
    { value: 'us-west-2', label: 'US West (Oregon)', code: 'us-west-2' },
    { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)', code: 'ap-northeast-2' },
    { value: 'eu-west-1', label: 'Europe (Ireland)', code: 'eu-west-1' },
  ];

  return (
    <div className="s3-create-page">
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
              AWS S3 버킷 생성
            </Title>
            <Text className="page-description">
              Amazon Simple Storage Service 버킷을 생성하고 구성합니다.
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
          <Text type="secondary">미리 설정된 템플릿으로 빠르게 S3 버킷을 생성하세요</Text>
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
          className="s3-create-form"
          requiredMark={false}
          initialValues={{
            storageClass: 'STANDARD',
            region: 'us-east-1',
            enableVersioning: false,
            blockPublicAccess: true,
            enableEncryption: true,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={3} className="section-title">
                <CloudOutlined className="section-icon" />
                기본 설정
              </Title>
              <Text type="secondary">S3 버킷의 기본 정보를 설정합니다.</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="bucketName"
                  label="버킷 이름"
                  rules={[
                    { required: true, message: '버킷 이름을 입력해주세요.' },
                    { min: 3, max: 63, message: '버킷 이름은 3-63자 사이여야 합니다.' },
                    {
                      pattern: /^[a-z0-9.-]+$/,
                      message: '소문자, 숫자, 점, 하이픈만 사용 가능합니다.',
                    },
                  ]}
                >
                  <Input placeholder="my-s3-bucket" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="region"
                  label="리전"
                  rules={[{ required: true, message: '리전을 선택해주세요.' }]}
                >
                  <Select placeholder="리전을 선택하세요" size="large">
                    {regions.map((region) => (
                      <Option key={region.value} value={region.value}>
                        <div className="region-option">
                          <span className="region-label">{region.label}</span>
                          <Tag color="blue" className="region-code">
                            {region.code}
                          </Tag>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item name="description" label="설명 (선택사항)">
                  <TextArea placeholder="버킷에 대한 설명을 입력하세요" rows={3} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 스토리지 클래스 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={3} className="section-title">
                <DatabaseOutlined className="section-icon" />
                스토리지 클래스 설정
              </Title>
              <Text type="secondary">버킷의 기본 스토리지 클래스를 설정합니다.</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item
                  name="storageClass"
                  label="기본 스토리지 클래스"
                  rules={[{ required: true, message: '스토리지 클래스를 선택해주세요.' }]}
                >
                  <Radio.Group className="storage-class-group">
                    {storageClasses.map((storage) => (
                      <Radio key={storage.value} value={storage.value} className="storage-radio">
                        <div className="storage-option">
                          <div className="storage-info">
                            <span className="storage-name">{storage.label}</span>
                            <span className="storage-description">{storage.description}</span>
                          </div>
                          <Tag color="green" className="storage-price">
                            {storage.price}
                          </Tag>
                        </div>
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 버전 관리 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={3} className="section-title">
                <LockOutlined className="section-icon" />
                버전 관리 설정
              </Title>
              <Text type="secondary">버킷의 버전 관리 및 백업을 설정합니다.</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="enableVersioning"
                  label="버전 관리 활성화"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enableMFA"
                  label="MFA 삭제 보호"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="lifecycleDays" label="라이프사이클 전환 일수" initialValue={30}>
                  <Input placeholder="30" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="deleteAfterDays" label="완전 삭제 일수" initialValue={365}>
                  <Input placeholder="365" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 보안 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={3} className="section-title">
                <SecurityScanOutlined className="section-icon" />
                보안 설정
              </Title>
              <Text type="secondary">버킷의 보안 및 액세스 제어를 설정합니다.</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="blockPublicAccess"
                  label="퍼블릭 액세스 차단"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enableEncryption"
                  label="서버 측 암호화"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item name="encryptionType" label="암호화 타입" initialValue="AES256">
                  <Select size="large">
                    <Option value="AES256">AES-256 (Amazon S3 관리 키)</Option>
                    <Option value="aws:kms">AWS KMS</Option>
                    <Option value="aws:kms:aws:managed">AWS KMS (AWS 관리 키)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="enableAccessLogging"
                  label="액세스 로깅"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item name="corsRules" label="CORS 규칙 (선택사항)">
                  <TextArea
                    placeholder='[{"AllowedHeaders":["*"],"AllowedMethods":["GET","PUT"],"AllowedOrigins":["*"],"MaxAgeSeconds":3000}]'
                    rows={4}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 태그 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={3} className="section-title">
                <GlobalOutlined className="section-icon" />
                태그 설정
              </Title>
              <Text type="secondary">버킷에 태그를 추가하여 관리합니다.</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Form.Item name="tags" label="태그 (선택사항)">
                  <TextArea
                    placeholder="Name=MyBucket,Environment=Production,Project=WebApp,CostCenter=IT"
                    rows={3}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
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
                S3 버킷 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default S3CreatePage;
