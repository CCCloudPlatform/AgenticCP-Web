import { create } from 'zustand';
import { authorizationService } from '@/services/authorizationService';

interface AuthorizationState {
  // 상태
  userPermissions: string[];
  userRoles: string[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // 액션
  fetchUserPermissions: () => Promise<void>;
  fetchUserRoles: () => Promise<void>;
  hasPermission: (permissionKey: string) => boolean;
  hasRole: (roleKey: string | string[]) => boolean;
  clearCache: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// 캐시 유효 시간 (5분)
const CACHE_DURATION = 5 * 60 * 1000;

export const useAuthorizationStore = create<AuthorizationState>((set, get) => ({
  // 초기 상태
  userPermissions: [],
  userRoles: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  // 사용자 권한 목록 조회
  fetchUserPermissions: async () => {
    const { lastFetched, isLoading } = get();
    
    // 이미 로딩 중이거나 캐시가 유효한 경우 스킵
    if (isLoading || (lastFetched && Date.now() - lastFetched < CACHE_DURATION)) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await authorizationService.getUserPermissions();
      
      if (response.success) {
        set({ 
          userPermissions: response.data.permissions,
          lastFetched: Date.now(),
          isLoading: false 
        });
      } else {
        throw new Error('권한 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('권한 목록 조회 오류:', error);
      set({ 
        error: error instanceof Error ? error.message : '권한 목록 조회에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 사용자 역할 목록 조회
  fetchUserRoles: async () => {
    const { lastFetched, isLoading } = get();
    
    // 이미 로딩 중이거나 캐시가 유효한 경우 스킵
    if (isLoading || (lastFetched && Date.now() - lastFetched < CACHE_DURATION)) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const response = await authorizationService.getUserRoles();
      
      if (response.success) {
        set({ 
          userRoles: response.data.roles,
          lastFetched: Date.now(),
          isLoading: false 
        });
      } else {
        throw new Error('역할 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('역할 목록 조회 오류:', error);
      set({ 
        error: error instanceof Error ? error.message : '역할 목록 조회에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 권한 보유 여부 확인
  hasPermission: (permissionKey: string) => {
    const { userPermissions } = get();
    return userPermissions.includes(permissionKey);
  },

  // 역할 보유 여부 확인
  hasRole: (roleKey: string | string[]) => {
    const { userRoles } = get();
    
    if (Array.isArray(roleKey)) {
      // 여러 역할 중 하나라도 보유하면 true
      return roleKey.some(role => userRoles.includes(role));
    } else {
      // 단일 역할 보유 여부 확인
      return userRoles.includes(roleKey);
    }
  },

  // 캐시 초기화
  clearCache: () => {
    set({ 
      userPermissions: [],
      userRoles: [],
      lastFetched: null,
      error: null 
    });
  },

  // 로딩 상태 설정
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));
