import { apiRequest } from './api';
import { LoginRequest, LoginResponse, LoginApiResponse, LoginErrorResponse, RegisterRequest, RegisterResponse, RegisterApiResponse, RegisterErrorResponse, User } from '@/types';

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
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // 🔧 개발 모드: 하드코딩된 계정 체크
      if (
        credentials.username === DEV_ACCOUNT.username &&
        credentials.password === DEV_ACCOUNT.password
      ) {
        console.log('🔓 개발용 하드코딩 계정으로 로그인');
        
        // 개발 모드에서도 토큰 저장
        localStorage.setItem('accessToken', MOCK_TOKEN);
        localStorage.setItem('refreshToken', MOCK_REFRESH_TOKEN);
        localStorage.setItem('tokenType', 'Bearer');
        localStorage.setItem('expiresIn', '3600');
        localStorage.setItem('refreshExpiresIn', '604800');
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        
        return {
          accessToken: MOCK_TOKEN,
          refreshToken: MOCK_REFRESH_TOKEN,
          tokenType: 'Bearer',
          expiresIn: 3600,
          refreshExpiresIn: 604800,
        };
      }

      // 실제 API 호출 (백엔드 연동 후)
      const response = await apiRequest.post<LoginApiResponse>('/auth/login', credentials);
      
      if (response.success) {
        // 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('tokenType', response.data.tokenType);
        localStorage.setItem('expiresIn', response.data.expiresIn.toString());
        localStorage.setItem('refreshExpiresIn', response.data.refreshExpiresIn.toString());
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        
        return response.data;
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    try {
      // localStorage에서 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('refreshExpiresIn');
      
      // 백엔드 로그아웃 API 호출 (선택사항)
      await apiRequest.post<void>('/auth/logout');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 토큰은 이미 제거되었으므로 에러를 무시
    }
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
    return apiRequest.post<void>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    const expiresIn = localStorage.getItem('expiresIn');
    
    if (!token || !expiresIn) {
      return false;
    }

    // 토큰 만료 시간 체크
    const tokenTimestamp = parseInt(localStorage.getItem('tokenTimestamp') || '0');
    const currentTime = Date.now();
    const tokenExpiry = tokenTimestamp + (parseInt(expiresIn) * 1000);
    
    return currentTime < tokenExpiry;
  },

  /**
   * Get stored token
   */
  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      // 🔧 개발 모드: 하드코딩된 계정 체크 (중복 방지)
      if (userData.username === DEV_ACCOUNT.username) {
        throw new Error('사용자명이 이미 존재합니다.');
      }

      // 실제 API 호출 (백엔드 연동 후)
      const response = await apiRequest.post<RegisterApiResponse>('/auth/register', {
        ...userData,
        tenantKey: userData.tenantKey || 'default'
      });
      
      if (response.success) {
        // 토큰을 localStorage에 저장
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('tokenType', response.data.tokenType);
        localStorage.setItem('expiresIn', response.data.expiresIn.toString());
        localStorage.setItem('refreshExpiresIn', response.data.refreshExpiresIn.toString());
        localStorage.setItem('tokenTimestamp', Date.now().toString());
        
        return response.data;
      } else {
        throw new Error('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  },
};

