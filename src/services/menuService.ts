import { apiRequest } from './api';
import { 
  ApiResponse, 
  Menu, 
  AccessType 
} from '@/types';

/**
 * Menu Service
 * 사용자 권한 기반 메뉴 조회 및 관리 서비스
 */
export const menuService = {
  /**
   * 사용자별 접근 가능한 메뉴 목록 조회
   * @returns 현재 사용자가 접근 가능한 메뉴 목록
   */
  getAccessibleMenus: (): Promise<ApiResponse<Menu[]>> => {
    return apiRequest.get('/api/v1/menus');
  },

  /**
   * 최상위 메뉴 목록 조회
   * @returns 최상위 메뉴 목록
   */
  getRootMenus: (): Promise<ApiResponse<Menu[]>> => {
    return apiRequest.get('/api/v1/menus/root');
  },

  /**
   * 특정 부모 메뉴의 하위 메뉴 조회
   * @param parentId 부모 메뉴 ID
   * @returns 하위 메뉴 목록
   */
  getChildMenus: (parentId: number): Promise<ApiResponse<Menu[]>> => {
    return apiRequest.get(`/api/v1/menus/parent/${parentId}`);
  },

  /**
   * 메뉴 상세 정보 조회
   * @param menuId 메뉴 ID
   * @returns 메뉴 상세 정보
   */
  getMenuById: (menuId: number): Promise<ApiResponse<Menu>> => {
    return apiRequest.get(`/api/v1/menus/${menuId}`);
  },

  /**
   * 메뉴 접근 권한 확인
   * @param menuKey 메뉴 키
   * @param accessType 접근 타입 (선택사항)
   * @returns 접근 권한 보유 여부
   */
  checkMenuAccess: (menuKey: string, accessType?: AccessType): Promise<ApiResponse<{ hasAccess: boolean }>> => {
    return apiRequest.get('/api/v1/security/menu/access', {
      params: { menuKey, accessType }
    });
  },

  /**
   * 메뉴 생성 (관리자용)
   * @param menuData 메뉴 생성 데이터
   * @returns 생성된 메뉴 정보
   */
  createMenu: (menuData: {
    menuKey: string;
    menuName: string;
    description?: string;
    url?: string;
    icon?: string;
    parentId?: number;
    sortOrder?: number;
    isSystem?: boolean;
  }): Promise<ApiResponse<Menu>> => {
    return apiRequest.post('/api/v1/menus', menuData);
  },

  /**
   * 메뉴 수정 (관리자용)
   * @param menuId 메뉴 ID
   * @param menuData 메뉴 수정 데이터
   * @returns 수정된 메뉴 정보
   */
  updateMenu: (menuId: number, menuData: {
    menuKey?: string;
    menuName?: string;
    description?: string;
    url?: string;
    icon?: string;
    parentId?: number;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<ApiResponse<Menu>> => {
    return apiRequest.put(`/api/v1/menus/${menuId}`, menuData);
  },

  /**
   * 메뉴 삭제 (관리자용)
   * @param menuId 메뉴 ID
   * @returns 삭제 완료
   */
  deleteMenu: (menuId: number): Promise<ApiResponse<null>> => {
    return apiRequest.delete(`/api/v1/menus/${menuId}`);
  },

  /**
   * 메뉴에 권한 할당 (관리자용)
   * @param menuId 메뉴 ID
   * @param permissionData 권한 할당 데이터
   * @returns 할당된 메뉴 권한 정보
   */
  assignMenuPermission: (menuId: number, permissionData: {
    permissionId: number;
    accessType: AccessType;
  }): Promise<ApiResponse<any>> => {
    return apiRequest.post(`/api/v1/menus/${menuId}/permissions`, permissionData);
  },

  /**
   * 메뉴에서 권한 제거 (관리자용)
   * @param menuId 메뉴 ID
   * @param permissionId 권한 ID
   * @returns 제거 완료
   */
  removeMenuPermission: (menuId: number, permissionId: number): Promise<ApiResponse<null>> => {
    return apiRequest.delete(`/api/v1/menus/${menuId}/permissions/${permissionId}`);
  },
};
