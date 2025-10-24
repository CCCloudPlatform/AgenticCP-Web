import { Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
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

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  // 🔧 개발용: 기본값 설정
  const defaultValues = {
    username: 'agenticcp',
    password: 'agenticcpwebpw',
  };

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
        <LoginForm
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
          defaultValues={defaultValues}
        />
      </Card>
    </div>
  );
};

export default LoginPage;

