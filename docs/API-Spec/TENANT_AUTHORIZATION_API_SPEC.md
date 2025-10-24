# 테넌트별 권한 격리 시스템 API 스펙

## 개요

테넌트 컨텍스트 기반으로 역할/권한/데이터를 완전 분리하고, 신규 테넌트 생성 시 기본 권한/역할을 자동 세팅하는 시스템입니다. 권한/역할 목록은 테넌트 단위 캐시로 성능을 확보하며, 테넌트 경계에서의 권한 검증을 제공합니다.

## 기본 정보

- **Base URL**: `/api/v1/tenants/{tenantKey}`
- **인증**: Bearer Token (JWT)
- **테넌트 헤더**: `X-Tenant-Key` (필수)
- **Content-Type**: `application/json`

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 테넌트 권한 관리 API

### 1. 테넌트 기본 권한/역할 초기화
- **URL**: `POST /init-permissions`
- **설명**: 신규 테넌트의 기본 권한/역할을 초기화합니다
- **권한**: ADMIN 역할 필요
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

**경로 변수**:
- `tenantKey` (string, required): 테넌트 키

**응답 예시:**
```json
{
  "success": true,
  "data": null,
  "message": "테넌트 권한/역할이 초기화되었습니다",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 테넌트 역할 조회
- **URL**: `GET /roles`
- **설명**: 테넌트별 역할 목록을 조회합니다 (캐시 10분)
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

**경로 변수**:
- `tenantKey` (string, required): 테넌트 키

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "roleKey": "ADMIN",
      "roleName": "관리자",
      "description": "시스템 관리자 역할",
      "tenantKey": "tenant-001",
      "tenantName": "테넌트001",
      "status": "ACTIVE",
      "isSystem": true,
      "isDefault": false,
      "priority": 100,
      "permissions": [
        {
          "id": 1,
          "permissionKey": "user.create",
          "permissionName": "사용자 생성",
          "resource": "user",
          "action": "create",
          "category": "USER_MANAGEMENT"
        }
      ],
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z",
      "createdBy": "admin",
      "updatedBy": "admin"
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 3. 테넌트 권한 조회
- **URL**: `GET /permissions`
- **설명**: 테넌트별 권한 목록을 조회합니다 (캐시 10분)
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

**경로 변수**:
- `tenantKey` (string, required): 테넌트 키

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "permissionKey": "user.create",
      "permissionName": "사용자 생성",
      "description": "새로운 사용자를 생성할 수 있는 권한",
      "tenantKey": "tenant-001",
      "tenantName": "테넌트001",
      "status": "ACTIVE",
      "resource": "user",
      "action": "create",
      "isSystem": true,
      "category": "USER_MANAGEMENT",
      "priority": 100,
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z",
      "createdBy": "system",
      "updatedBy": "system"
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 4. 테넌트 캐시 무효화
- **URL**: `POST /cache/evict`
- **설명**: 테넌트의 권한/역할 캐시를 무효화합니다
- **권한**: ADMIN 역할 필요
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

**경로 변수**:
- `tenantKey` (string, required): 테넌트 키

**응답**: `204 No Content`

## 테넌트 권한 검증 API

### 1. 테넌트 접근 권한 검증
- **URL**: `POST /api/v1/security/tenant/validate`
- **설명**: 현재 사용자가 특정 테넌트에 접근할 권한이 있는지 검증합니다
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}` (optional)

**요청 본문:**
```json
{
  "tenantKey": "tenant-001"
}
```

**응답**: 
- `204 No Content`: 검증 성공
- `403 Forbidden`: 테넌트 접근 권한 없음

## 테넌트 인식 권한 검증 서비스

### 1. TenantAwareAuthorizationService

테넌트 컨텍스트를 인식하여 권한을 검증하는 서비스입니다.

**주요 메서드**:
- `hasRoleInTenant(String tenantKey, String roleKey)`: 테넌트 내 특정 역할 보유 여부 확인
- `hasPermissionInTenant(String tenantKey, String permissionKey)`: 테넌트 내 특정 권한 보유 여부 확인

**사용 예시**:
```java
@Service
public class UserService {
    
    @Autowired
    private TenantAwareAuthorizationService tenantAwareAuthService;
    
    public void checkUserAccess(String tenantKey, String roleKey) {
        if (!tenantAwareAuthService.hasRoleInTenant(tenantKey, roleKey)) {
            throw new AccessDeniedException("해당 테넌트에서 권한이 없습니다");
        }
    }
}
```

## 캐시 정책

### 1. 캐시 키 구조
- 테넌트 역할: `tenant_roles:{tenantKey}`
- 테넌트 권한: `tenant_permissions:{tenantKey}`

### 2. 캐시 TTL
- **기본 TTL**: 10분
- **무효화**: 권한/역할 변경 시 즉시 무효화

### 3. 캐시 무효화 전략
- 테넌트별 부분 무효화 지원
- Redis Pub/Sub 확장 가능 (향후 구현)

## 데이터 모델

### Role (역할)
```json
{
  "id": "number",
  "roleKey": "string (2-50자, 테넌트 내 유일)",
  "roleName": "string (2-100자)",
  "description": "string (최대 500자)",
  "tenantKey": "string",
  "tenantName": "string",
  "status": "ACTIVE | INACTIVE | SUSPENDED",
  "isSystem": "boolean",
  "isDefault": "boolean",
  "priority": "number",
  "permissions": "Permission[]",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string",
  "updatedBy": "string"
}
```

### Permission (권한)
```json
{
  "id": "number",
  "permissionKey": "string (2-50자, 테넌트 내 유일)",
  "permissionName": "string (2-100자)",
  "description": "string (최대 500자)",
  "tenantKey": "string",
  "tenantName": "string",
  "status": "ACTIVE | INACTIVE | SUSPENDED",
  "resource": "string (최대 100자)",
  "action": "string (최대 50자)",
  "isSystem": "boolean",
  "category": "string (최대 50자)",
  "priority": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string",
  "updatedBy": "string"
}
```

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `TENANT_ACCESS_DENIED` | 403 | 테넌트 접근 권한 없음 |
| `TENANT_NOT_FOUND` | 404 | 테넌트를 찾을 수 없음 |
| `INVALID_TENANT_CONTEXT` | 400 | 유효하지 않은 테넌트 컨텍스트 |
| `TENANT_CONTEXT_MISMATCH` | 400 | 테넌트 컨텍스트 불일치 |
| `FORBIDDEN` | 403 | 접근 권한이 없음 |
| `UNAUTHORIZED` | 401 | 인증되지 않은 사용자 |

