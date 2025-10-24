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
    // 실제 API 호출
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

