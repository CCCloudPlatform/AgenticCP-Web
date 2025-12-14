import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import AppRoutes from '@/routes';
import { DEV_CONFIG } from '@/config/dev';

function App() {
  const { initAuth, devQuickLogin, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize authentication on app load
    initAuth();
    
    // 🔧 개발 모드: 슈퍼 계정으로 자동 로그인
    if (DEV_CONFIG.ENABLE_AUTO_LOGIN && !isAuthenticated) {
      devQuickLogin().catch((error) => {
        console.error('자동 로그인 실패:', error);
      });
    }
  }, [initAuth, devQuickLogin, isAuthenticated]);

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

