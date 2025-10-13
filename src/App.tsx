import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppRoutes from '@/routes';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app load
    initAuth();
  }, [initAuth]);

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
}

export default App;

