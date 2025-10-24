import { Card, Typography, message, Space } from 'antd';
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
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
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
                <span className="badge-icon">🔓</span>
                <span className="badge-text">로그인하여 시작하세요</span>
              </div>
            </div>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            loading={isLoading}
            error={error}
            defaultValues={defaultValues}
          />

          <div className="login-footer">
            <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
              <Text type="secondary" className="footer-text">
                계정이 없으신가요?
              </Text>
              <a 
                href={ROUTES.REGISTER} 
                className="register-link"
              >
                회원가입하기
              </a>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

