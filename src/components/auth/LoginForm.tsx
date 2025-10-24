import { Form, Input, Button, Switch, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  totpCode?: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  defaultValues?: Partial<LoginFormValues>;
}

const LoginForm = ({ onSubmit, loading = false, error, defaultValues }: LoginFormProps) => {
  const [form] = Form.useForm();
  const [showTotp, setShowTotp] = useState(false);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
      console.error('Login form error:', error);
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleSubmit}
      size="large"
      layout="vertical"
      initialValues={defaultValues}
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: '사용자명을 입력하세요' },
          { min: 2, max: 50, message: '사용자명은 2-50자여야 합니다' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="사용자명"
          autoComplete="username"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: '비밀번호를 입력하세요' },
          { min: 8, max: 100, message: '비밀번호는 8-100자여야 합니다' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="비밀번호"
          autoComplete="current-password"
          disabled={loading}
        />
      </Form.Item>
      
      <div style={{ marginBottom: 16 }}>
        <Switch
          checked={showTotp}
          onChange={setShowTotp}
          size="small"
          disabled={loading}
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
            disabled={loading}
          />
        </Form.Item>
      )}

      {error && (
        <div style={{ 
          marginBottom: 16, 
          padding: 8, 
          background: '#fff2f0', 
          border: '1px solid #ffccc7', 
          borderRadius: 4,
          color: '#ff4d4f',
          fontSize: 12
        }}>
          {error}
        </div>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
