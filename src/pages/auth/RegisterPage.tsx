import { Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { useEffect } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import './RegisterPage.scss';

const { Title, Text } = Typography;

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  tenantKey?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register(values);
      message.success('회원가입이 완료되었습니다!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Error handled by useEffect
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card">
        <div className="register-header">
          <Title level={2}>AgenticCP</Title>
          <Text type="secondary">Multi-Cloud Platform</Text>
          <div style={{ marginTop: 16, padding: 12, background: '#f0f9ff', borderRadius: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              🎉 새로운 계정을 만들어보세요
            </Text>
          </div>
        </div>
        <RegisterForm
          onSubmit={handleSubmit}
          loading={isLoading}
          error={error}
        />
        <div className="register-footer">
          <Text type="secondary">
            이미 계정이 있으신가요?{' '}
            <a href={ROUTES.LOGIN} style={{ color: '#1890ff' }}>
              로그인
            </a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
