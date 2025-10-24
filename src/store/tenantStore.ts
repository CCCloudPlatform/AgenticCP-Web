import { create } from 'zustand';
import { TenantContext } from '@/types';
import { DEFAULT_TENANT } from '@/constants';

interface TenantState {
  // 상태
  currentTenant: TenantContext;
  availableTenants: TenantContext[];
  isLoading: boolean;
  error: string | null;
  
  // 액션
  setTenant: (tenant: TenantContext) => void;
  initTenant: () => void;
  addTenant: (tenant: TenantContext) => void;
  removeTenant: (tenantKey: string) => void;
  clearError: () => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  // 초기 상태
  currentTenant: {
    tenantKey: DEFAULT_TENANT.TENANT_KEY,
    tenantName: DEFAULT_TENANT.TENANT_NAME,
  },
  availableTenants: [
    {
      tenantKey: DEFAULT_TENANT.TENANT_KEY,
      tenantName: DEFAULT_TENANT.TENANT_NAME,
    }
  ],
  isLoading: false,
  error: null,

  // 테넌트 설정
  setTenant: (tenant: TenantContext) => {
    const { availableTenants } = get();
    
    // 사용 가능한 테넌트 목록에 있는지 확인
    const isValidTenant = availableTenants.some(t => t.tenantKey === tenant.tenantKey);
    
    if (isValidTenant) {
      set({ currentTenant: tenant });
      
      // 로컬 스토리지에 현재 테넌트 저장
      localStorage.setItem('currentTenant', JSON.stringify(tenant));
      
      console.log(`테넌트 전환: ${tenant.tenantName} (${tenant.tenantKey})`);
    } else {
      set({ error: '유효하지 않은 테넌트입니다.' });
    }
  },

  // 테넌트 초기화 (더미 테넌트 설정)
  initTenant: () => {
    const storedTenant = localStorage.getItem('currentTenant');
    
    if (storedTenant) {
      try {
        const tenant: TenantContext = JSON.parse(storedTenant);
        set({ currentTenant: tenant });
      } catch (error) {
        console.error('저장된 테넌트 정보 파싱 오류:', error);
        // 파싱 오류 시 기본 테넌트로 설정
        set({ currentTenant: { 
          tenantKey: DEFAULT_TENANT.TENANT_KEY,
          tenantName: DEFAULT_TENANT.TENANT_NAME,
        }});
      }
    } else {
      // 저장된 테넌트가 없으면 기본 테넌트로 설정
      set({ currentTenant: { 
        tenantKey: DEFAULT_TENANT.TENANT_KEY,
        tenantName: DEFAULT_TENANT.TENANT_NAME,
      }});
    }
  },

  // 테넌트 추가 (추후 확장용)
  addTenant: (tenant: TenantContext) => {
    const { availableTenants } = get();
    
    // 중복 확인
    const exists = availableTenants.some(t => t.tenantKey === tenant.tenantKey);
    
    if (!exists) {
      set({ 
        availableTenants: [...availableTenants, tenant] 
      });
    } else {
      set({ error: '이미 존재하는 테넌트입니다.' });
    }
  },

  // 테넌트 제거 (추후 확장용)
  removeTenant: (tenantKey: string) => {
    const { availableTenants, currentTenant } = get();
    
    // 현재 테넌트는 제거할 수 없음
    if (currentTenant.tenantKey === tenantKey) {
      set({ error: '현재 사용 중인 테넌트는 제거할 수 없습니다.' });
      return;
    }
    
    set({ 
      availableTenants: availableTenants.filter(t => t.tenantKey !== tenantKey)
    });
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null });
  },
}));
