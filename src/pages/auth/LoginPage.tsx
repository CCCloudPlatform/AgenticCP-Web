import { Form, Input, Button, Card, Typography, message, Switch } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { useEffect, useState } from 'react';
import './LoginPage.scss';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  totpCode?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const [form] = Form.useForm();
  const [showTotp, setShowTotp] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // 🔧 개발용: 기본값 설정
  useEffect(() => {
    form.setFieldsValue({
      username: 'agenticcp',
      password: 'agenticcpwebpw',
    });
  }, [form]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      message.success('로그인 성공');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Error handled by useEffect
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>AgenticCP</Title>
          <Text type="secondary">Multi-Cloud Platform</Text>
          <div style={{ marginTop: 16, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
            <Text type="warning" style={{ fontSize: 12 }}>
              🔧 개발 모드: 하드코딩 계정
            </Text>
            <br />
            <Text code style={{ fontSize: 11 }}>
              ID: agenticcp / PW: agenticcpwebpw
            </Text>
          </div>
        </div>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '사용자명을 입력하세요' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="사용자명"
              autoComplete="username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력하세요' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
          </Form.Item>
          
          <div style={{ marginBottom: 16 }}>
            <Switch
              checked={showTotp}
              onChange={setShowTotp}
              size="small"
            />
            <Text style={{ marginLeft: 8, fontSize: 12 }}>
              2단계 인증 (2FA) 사용
            </Text>
          </div>
          
          {showTotp && (
            <Form.Item
              name="totpCode"
              rules={[
                { required: showTotp, message: '인증 코드를 입력하세요' },
                { len: 6, message: '인증 코드는 6자리여야 합니다' },
                { pattern: /^\d{6}$/, message: '숫자만 입력 가능합니다' }
              ]}
            >
              <Input
                prefix={<SafetyOutlined />}
                placeholder="6자리 인증 코드"
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '0.2em' }}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
            >
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;

