import { create } from 'zustand';
import { User, LoginRequest } from '@/types';
import { authService } from '@/services/authService';
import { storage } from '@/utils/storage';
import { STORAGE_KEYS } from '@/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
  clearError: () => void;
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
      const { token, refreshToken, user } = response;

      storage.set(STORAGE_KEYS.TOKEN, token);
      storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      storage.set(STORAGE_KEYS.USER_INFO, user);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
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

    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

