/**
 * Development Configuration
 * 🔧 백엔드 연동 전 개발용 설정
 */

export const DEV_CONFIG = {
  // 하드코딩 계정
  HARDCODED_ACCOUNT: {
    username: 'agenticcp',
    password: 'agenticcpwebpw',
    user: {
      id: 1,
      username: 'agenticcp',
      email: 'admin@agenticcp.com',
      name: 'Super Admin (DEV)',
      role: 'SUPER_ADMIN' as const,
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },

  // Mock 모드 활성화
  ENABLE_MOCK: true,

  // Mock API 딜레이 (ms)
  MOCK_API_DELAY: 1000,

  // 개발 모드 로그
  ENABLE_DEV_LOG: true,
};

/**
 * 개발 모드 로그
 */
export const devLog = (message: string, ...args: unknown[]) => {
  if (DEV_CONFIG.ENABLE_DEV_LOG) {
    console.log(`🔧 [DEV] ${message}`, ...args);
  }
};

