import { Card, Typography, message, Space } from 'antd';
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
      <div className="register-container">
        <Card className="register-card">
          <div className="register-header">
            <div className="logo-section">
              <div className="logo-icon">
                <div className="logo-inner">
                  <span className="logo-text">AC</span>
                </div>
                <div className="logo-glow"></div>
              </div>
              <div className="logo-content">
                <Title level={2} className="brand-title">
                  AgenticCP
                </Title>
                <Text className="brand-subtitle">
                  Multi-Cloud Platform
                </Text>
              </div>
            </div>
            
            <div className="welcome-section">
              <div className="welcome-badge">
                <span className="badge-icon">🚀</span>
                <span className="badge-text">새로운 계정을 만들어보세요</span>
              </div>
            </div>
          </div>

          <RegisterForm
            onSubmit={handleSubmit}
            loading={isLoading}
            error={error}
          />

          <div className="register-footer">
            <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
              <Text type="secondary" className="footer-text">
                이미 계정이 있으신가요?
              </Text>
              <a 
                href={ROUTES.LOGIN} 
                className="login-link"
              >
                로그인하기
              </a>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
