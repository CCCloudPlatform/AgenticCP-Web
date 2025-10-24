import { apiRequest } from './api';
import { 
  ApiResponse, 
  AuthorizationCheckResponse, 
  AuthorizationCheckRequest,
  TenantContext 
} from '@/types';

/**
 * Authorization Service
 * 백엔드 권한 검증 API와 연동하는 서비스 레이어
 */
export const authorizationService = {
  /**
   * 권한 확인
   * @param permissionKey 확인할 권한 키
   * @returns 권한 보유 여부
   */
  checkPermission: (permissionKey: string): Promise<ApiResponse<AuthorizationCheckResponse>> => {
    return apiRequest.get(`/api/v1/security/check/permission`, {
      params: { permissionKey }
    });
  },

  /**
   * 역할 확인
   * @param roleKey 확인할 역할 키
   * @returns 역할 보유 여부
   */
  checkRole: (roleKey: string): Promise<ApiResponse<AuthorizationCheckResponse>> => {
    return apiRequest.get(`/api/v1/security/check/role`, {
      params: { roleKey }
    });
  },

  /**
   * 사용자 권한 목록 조회
   * @returns 사용자가 보유한 모든 권한 목록
   */
  getUserPermissions: (): Promise<ApiResponse<{ permissions: string[] }>> => {
    return apiRequest.get(`/api/v1/security/me/permissions`);
  },

  /**
   * 사용자 역할 목록 조회
   * @returns 사용자가 보유한 모든 역할 목록
   */
  getUserRoles: (): Promise<ApiResponse<{ roles: string[] }>> => {
    return apiRequest.get(`/api/v1/security/me/roles`);
  },

  /**
   * 테넌트 접근 권한 검증
   * @param tenantKey 검증할 테넌트 키
   * @returns 검증 성공 시 void, 실패 시 에러 발생
   */
  validateTenantAccess: (tenantKey: string): Promise<void> => {
    return apiRequest.post(`/api/v1/security/tenant/validate`, { tenantKey });
  },

  /**
   * 현재 사용자 정보 조회
   * @returns 현재 인증된 사용자 정보
   */
  getCurrentUser: (): Promise<ApiResponse<{ username: string }>> => {
    return apiRequest.get(`/api/v1/security/me`);
  },

  /**
   * 권한 캐시 무효화
   * @param username 사용자명 (선택사항)
   * @returns 캐시 무효화 완료
   */
  evictPermissionCache: (username?: string): Promise<void> => {
    return apiRequest.post(`/api/v1/security/cache/permissions/evict`, { username });
  },

  /**
   * 권한 캐시 워밍업
   * @param username 사용자명 (선택사항)
   * @returns 캐시 워밍업 완료
   */
  warmPermissionCache: (username?: string): Promise<void> => {
    return apiRequest.post(`/api/v1/security/cache/permissions/warm`, { username });
  },
};
