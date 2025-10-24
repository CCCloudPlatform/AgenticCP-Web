import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';
import AppRoutes from '@/routes';

function App() {
  const { initAuth } = useAuthStore();
  const { initTenant } = useTenantStore();

  useEffect(() => {
    // Initialize authentication and tenant context on app load
    initAuth();
    initTenant();
  }, [initAuth, initTenant]);

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

