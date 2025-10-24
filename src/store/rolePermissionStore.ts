import { create } from 'zustand';
import { 
  Role, 
  Permission, 
  RoleCreateRequest, 
  RoleUpdateRequest, 
  PermissionCreateRequest, 
  PermissionUpdateRequest 
} from '@/types';
import { rolePermissionService } from '@/services/rolePermissionService';

interface RolePermissionState {
  // 상태
  roles: Role[];
  permissions: Permission[];
  selectedRole: Role | null;
  isLoading: boolean;
  error: string | null;
  
  // 액션
  fetchRoles: () => Promise<void>;
  fetchPermissions: () => Promise<void>;
  selectRole: (role: Role | null) => void;
  createRole: (data: RoleCreateRequest) => Promise<void>;
  updateRole: (roleKey: string, data: RoleUpdateRequest) => Promise<void>;
  deleteRole: (roleKey: string) => Promise<void>;
  updateRolePermissions: (roleId: number, permissionKeys: string[]) => Promise<void>;
  createPermission: (data: PermissionCreateRequest) => Promise<void>;
  updatePermission: (permissionKey: string, data: PermissionUpdateRequest) => Promise<void>;
  deletePermission: (permissionKey: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useRolePermissionStore = create<RolePermissionState>((set, get) => ({
  // 초기 상태
  roles: [],
  permissions: [],
  selectedRole: null,
  isLoading: false,
  error: null,

  // 역할 목록 조회
  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.getRoles();
      if (response.success) {
        set({ roles: response.data, isLoading: false });
      } else {
        set({ error: '역할 목록을 불러오는데 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '역할 목록을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 권한 목록 조회
  fetchPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.getPermissions();
      if (response.success) {
        set({ permissions: response.data, isLoading: false });
      } else {
        set({ error: '권한 목록을 불러오는데 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '권한 목록을 불러오는데 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 역할 선택
  selectRole: (role: Role | null) => {
    set({ selectedRole: role });
  },

  // 역할 생성
  createRole: async (data: RoleCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.createRole(data);
      if (response.success) {
        // 역할 목록 새로고침
        await get().fetchRoles();
        set({ isLoading: false });
      } else {
        set({ error: '역할 생성에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '역할 생성에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 역할 수정
  updateRole: async (roleKey: string, data: RoleUpdateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.updateRole(roleKey, data);
      if (response.success) {
        // 역할 목록 새로고침
        await get().fetchRoles();
        // 선택된 역할이 수정된 역할이면 업데이트
        const { selectedRole } = get();
        if (selectedRole && selectedRole.roleKey === roleKey) {
          const updatedRole = await rolePermissionService.getRoleByKey(roleKey);
          if (updatedRole.success) {
            set({ selectedRole: updatedRole.data, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ error: '역할 수정에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '역할 수정에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 역할 삭제
  deleteRole: async (roleKey: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.deleteRole(roleKey);
      if (response.success) {
        // 역할 목록 새로고침
        await get().fetchRoles();
        // 선택된 역할이 삭제된 역할이면 선택 해제
        const { selectedRole } = get();
        if (selectedRole && selectedRole.roleKey === roleKey) {
          set({ selectedRole: null, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ error: '역할 삭제에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '역할 삭제에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 역할 권한 업데이트
  updateRolePermissions: async (roleId: number, permissionKeys: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.updateRolePermissions(roleId, permissionKeys);
      if (response.success) {
        // 역할 목록 새로고침
        await get().fetchRoles();
        // 선택된 역할의 권한 정보 업데이트
        const { selectedRole } = get();
        if (selectedRole && selectedRole.id === roleId) {
          const updatedRole = await rolePermissionService.getRoleByKey(selectedRole.roleKey);
          if (updatedRole.success) {
            set({ selectedRole: updatedRole.data, isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      } else {
        set({ error: '역할 권한 업데이트에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '역할 권한 업데이트에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 권한 생성
  createPermission: async (data: PermissionCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.createPermission(data);
      if (response.success) {
        // 권한 목록 새로고침
        await get().fetchPermissions();
        set({ isLoading: false });
      } else {
        set({ error: '권한 생성에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '권한 생성에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 권한 수정
  updatePermission: async (permissionKey: string, data: PermissionUpdateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.updatePermission(permissionKey, data);
      if (response.success) {
        // 권한 목록 새로고침
        await get().fetchPermissions();
        set({ isLoading: false });
      } else {
        set({ error: '권한 수정에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '권한 수정에 실패했습니다.',
        isLoading: false 
      });
    }
  },

  // 권한 삭제
  deletePermission: async (permissionKey: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rolePermissionService.deletePermission(permissionKey);
      if (response.success) {
        // 권한 목록 새로고침
        await get().fetchPermissions();
        set({ isLoading: false });
      } else {
        set({ error: '권한 삭제에 실패했습니다.', isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '권한 삭제에 실패했습니다.',
        isLoading: false 
      });
    }
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
