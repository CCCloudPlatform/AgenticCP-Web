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
import './VPCCreatePage.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VPCCreatePage: React.FC = () => {
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
      console.log('VPC 생성 데이터:', values);
      // TODO: Implement VPC creation logic
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES.RESOURCES);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('VPC 생성 실패:', error);
    }
  };

  const cidrBlocks = [
    { value: '10.0.0.0/16', label: '10.0.0.0/16 (65,536 IPs)', recommended: true },
    { value: '172.16.0.0/16', label: '172.16.0.0/16 (65,536 IPs)', recommended: false },
    { value: '192.168.0.0/16', label: '192.168.0.0/16 (65,536 IPs)', recommended: false },
  ];

  const availabilityZones = [
    { value: 'us-east-1a', label: 'us-east-1a (Virginia)' },
    { value: 'us-east-1b', label: 'us-east-1b (Virginia)' },
    { value: 'us-east-1c', label: 'us-east-1c (Virginia)' },
    { value: 'us-west-2a', label: 'us-west-2a (Oregon)' },
    { value: 'us-west-2b', label: 'us-west-2b (Oregon)' },
  ];

  return (
    <div className="vpc-create-page">
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
              AWS VPC 생성
            </Title>
            <Text className="page-description">
              Amazon Virtual Private Cloud를 생성하고 네트워크를 구성합니다.
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
          <Title level={3}>⚙️ VPC 설정</Title>
          <Text type="secondary">AWS VPC의 기본 설정을 구성하세요</Text>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="vpc-create-form"
          requiredMark={false}
          initialValues={{
            cidrBlock: '10.0.0.0/16',
            enableInternetGateway: true,
            enableDNS: true,
          }}
        >
          {/* 기본 설정 */}
          <div className="form-section">
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="vpcName"
                  label="VPC 이름"
                  rules={[{ required: true, message: 'VPC 이름을 입력해주세요.' }]}
                >
                  <Input placeholder="my-vpc" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cidrBlock"
                  label="IPv4 CIDR 블록"
                  rules={[{ required: true, message: 'CIDR 블록을 선택해주세요.' }]}
                >
                  <Select placeholder="CIDR 블록을 선택하세요" size="large">
                    {cidrBlocks.map((block) => (
                      <Option key={block.value} value={block.value}>
                        <div className="cidr-option">
                          <span className="cidr-label">{block.label}</span>
                          {block.recommended && (
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
                  name="availabilityZone"
                  label="가용 영역"
                  rules={[{ required: true, message: '가용 영역을 선택해주세요.' }]}
                >
                  <Select placeholder="가용 영역을 선택하세요" size="large">
                    {availabilityZones.map((az) => (
                      <Option key={az.value} value={az.value}>
                        {az.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="description" label="설명 (선택사항)">
                  <Input placeholder="VPC에 대한 설명" size="large" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* 네트워크 설정 */}
          <div className="form-section">
            <div className="section-header">
              <Title level={4}>🌐 네트워크 설정</Title>
              <Text type="secondary">VPC의 네트워크 구성을 설정합니다</Text>
            </div>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="enableInternetGateway"
                  label="인터넷 게이트웨이 생성"
                  valuePropName="checked"
                >
                  <Switch size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enableDNS" label="DNS 호스트명 활성화" valuePropName="checked">
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
                  <strong>CIDR 블록:</strong> VPC의 IP 주소 범위를 정의합니다
                </li>
                <li>
                  <strong>가용 영역:</strong> 리소스의 가용성을 위해 여러 AZ를 선택하세요
                </li>
                <li>
                  <strong>인터넷 게이트웨이:</strong> VPC와 인터넷 간의 통신을 위해 필요합니다
                </li>
                <li>
                  <strong>DNS:</strong> 도메인 이름 해석을 위해 활성화하는 것을 권장합니다
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
                VPC 생성
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default VPCCreatePage;
