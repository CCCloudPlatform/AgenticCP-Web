import { apiRequest } from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

// 🔧 개발용 하드코딩 계정 (백엔드 연동 전까지 사용)
const DEV_ACCOUNT = {
  username: 'agenticcp',
  password: 'agenticcpwebpw',
};

const MOCK_USER: User = {
  id: 1,
  username: 'agenticcp',
  email: 'admin@agenticcp.com',
  name: 'Super Admin',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_TOKEN = 'mock-jwt-token-' + Date.now();
const MOCK_REFRESH_TOKEN = 'mock-refresh-token-' + Date.now();

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    // 🔧 개발 모드: 하드코딩된 계정 체크
    if (
      credentials.username === DEV_ACCOUNT.username &&
      credentials.password === DEV_ACCOUNT.password
    ) {
      console.log('🔓 개발용 하드코딩 계정으로 로그인');
      return Promise.resolve({
        token: MOCK_TOKEN,
        refreshToken: MOCK_REFRESH_TOKEN,
        user: MOCK_USER,
      });
    }

    // 실제 API 호출 (백엔드 연동 후)
    return apiRequest.post<LoginResponse>('/api/v1/auth/login', credentials);
  },

  /**
   * Logout
   */
  logout: (): Promise<void> => {
    return apiRequest.post<void>('/api/v1/auth/logout');
  },

  /**
   * Get current user
   */
  getCurrentUser: (): Promise<User> => {
    // 🔧 개발 모드: Mock 사용자 반환
    const token = localStorage.getItem('agenticcp_token');
    if (token && token.startsWith('mock-jwt-token')) {
      console.log('🔓 개발용 Mock 사용자 반환');
      return Promise.resolve(MOCK_USER);
    }

    return apiRequest.get<User>('/api/v1/auth/me');
  },

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string): Promise<{ token: string }> => {
    return apiRequest.post<{ token: string }>('/api/v1/auth/refresh', { refreshToken });
  },

  /**
   * Change password
   */
  changePassword: (oldPassword: string, newPassword: string): Promise<void> => {
    return apiRequest.post<void>('/api/v1/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },
};

