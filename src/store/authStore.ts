import { create } from 'zustand';
import { User, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (userData: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  initAuth: () => void;
  clearError: () => void;
  checkAuth: () => boolean;
  devQuickLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { accessToken, refreshToken } = response;

      // 토큰 저장
      storage.set(STORAGE_KEYS.TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      // 사용자 정보 가져오기
      const user = await authService.getCurrentUser();
      storage.set(STORAGE_KEYS.USER_INFO, user);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.remove(STORAGE_KEYS.TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_INFO);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  initAuth: () => {
    const token = storage.get<string>(STORAGE_KEYS.TOKEN);
    const user = storage.get<User>(STORAGE_KEYS.USER_INFO);

    if (token && user && authService.isAuthenticated()) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    }
  },

  checkAuth: () => {
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
    return isAuth;
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      const { accessToken, refreshToken } = response;

      // 토큰 저장
      storage.set(STORAGE_KEYS.TOKEN, accessToken);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

      // 사용자 정보 가져오기
      const user = await authService.getCurrentUser();
      storage.set(STORAGE_KEYS.USER_INFO, user);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  devQuickLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.devQuickLogin();
      
      // 사용자 정보와 토큰 저장
      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.USER_INFO, user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log('✅ [DEV] 슈퍼 계정 로그인 완료:', user.username);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '자동 로그인에 실패했습니다.',
        isLoading: false,
      });
      console.error('❌ [DEV] 슈퍼 계정 로그인 실패:', error);
    }
  },
}));

