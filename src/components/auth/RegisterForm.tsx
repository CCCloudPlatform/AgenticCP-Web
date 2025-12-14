import { Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './RegisterForm.scss';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  tenantKey?: string;
}

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const RegisterForm = ({ onSubmit, loading = false, error }: RegisterFormProps) => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
      console.error('Register form error:', error);
    }
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
  };

  return (
    <div className="register-form">
      <Form
        form={form}
        name="register"
        onFinish={handleSubmit}
        size="large"
        layout="vertical"
      >
      <Form.Item
        name="username"
        label="사용자명"
        rules={[
          { required: true, message: '사용자명을 입력하세요' },
          { min: 2, max: 50, message: '사용자명은 2-50자여야 합니다' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '영문, 숫자, 언더스코어만 사용 가능합니다' }
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
        name="email"
        label="이메일"
        rules={[
          { required: true, message: '이메일을 입력하세요' },
          { type: 'email', message: '유효한 이메일 형식이 아닙니다' },
          { max: 100, message: '이메일은 100자 이하여야 합니다' }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="이메일"
          autoComplete="email"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="name"
        label="이름"
        rules={[
          { required: true, message: '이름을 입력하세요' },
          { max: 100, message: '이름은 100자 이하여야 합니다' }
        ]}
      >
        <Input
          prefix={<IdcardOutlined />}
          placeholder="이름"
          autoComplete="name"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        rules={[
          { required: true, message: '비밀번호를 입력하세요' },
          { min: 8, max: 100, message: '비밀번호는 8-100자여야 합니다' },
          { 
            pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: '영문, 숫자, 특수문자를 포함해야 합니다'
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="비밀번호"
          autoComplete="new-password"
          disabled={loading}
          visibilityToggle={{
            visible: passwordVisible,
            onVisibleChange: setPasswordVisible
          }}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="비밀번호 확인"
        rules={[
          { required: true, message: '비밀번호 확인을 입력하세요' },
          { validator: validateConfirmPassword }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="비밀번호 확인"
          autoComplete="new-password"
          disabled={loading}
          visibilityToggle={{
            visible: confirmPasswordVisible,
            onVisibleChange: setConfirmPasswordVisible
          }}
        />
      </Form.Item>

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
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
      </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
