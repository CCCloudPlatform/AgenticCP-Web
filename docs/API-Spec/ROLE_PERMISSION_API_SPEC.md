# Role & Permission CRUD 관리 시스템 API 스펙

## 개요

RBAC(Role-Based Access Control) 기반의 역할(Role)과 권한(Permission) 관리 시스템 API입니다. 테넌트별 권한 격리를 지원하며, Spring Security와 연동하여 정책 적용이 가능합니다.

## 기본 정보

- **Base URL**: `/api/v1`
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

## 역할(Role) 관리 API

### 1. 모든 역할 조회
- **URL**: `GET /roles`
- **설명**: 현재 테넌트의 모든 역할을 조회합니다
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

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
  ]
}
```

### 2. 활성 역할 조회
- **URL**: `GET /roles/active`
- **설명**: 현재 테넌트의 활성 역할만 조회합니다

### 3. 시스템 역할 조회
- **URL**: `GET /roles/system`
- **설명**: 현재 테넌트의 시스템 역할을 조회합니다

### 4. 기본 역할 조회
- **URL**: `GET /roles/default`
- **설명**: 현재 테넌트의 기본 역할을 조회합니다

### 5. 특정 역할 조회
- **URL**: `GET /roles/{roleKey}`
- **설명**: 역할 키로 특정 역할을 조회합니다
- **경로 변수**: 
  - `roleKey` (string): 역할 키

### 6. 역할 생성
- **URL**: `POST /roles`
- **설명**: 새로운 역할을 생성합니다

**요청 본문:**
```json
{
  "roleKey": "MANAGER",
  "roleName": "매니저",
  "description": "부서 매니저 역할",
  "priority": 50,
  "permissionKeys": ["user.read", "user.update"],
  "isSystem": false
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "roleKey": "MANAGER",
    "roleName": "매니저",
    "description": "부서 매니저 역할",
    "tenantKey": "tenant-001",
    "status": "ACTIVE",
    "isSystem": false,
    "priority": 50,
    "permissions": [
      {
        "id": 2,
        "permissionKey": "user.read",
        "permissionName": "사용자 조회"
      },
      {
        "id": 3,
        "permissionKey": "user.update",
        "permissionName": "사용자 수정"
      }
    ],
    "createdAt": "2025-01-20T10:30:00Z",
    "createdBy": "admin"
  },
  "message": "역할이 생성되었습니다"
}
```

### 7. 역할 수정
- **URL**: `PUT /roles/{roleKey}`
- **설명**: 기존 역할을 수정합니다
- **경로 변수**: 
  - `roleKey` (string): 역할 키

**요청 본문:**
```json
{
  "roleName": "수정된 매니저",
  "description": "수정된 부서 매니저 역할",
  "priority": 60,
  "permissionKeys": ["user.read", "user.update", "user.delete"]
}
```

### 8. 역할 삭제
- **URL**: `DELETE /roles/{roleKey}`
- **설명**: 역할을 삭제합니다 (시스템 역할은 삭제 불가)
- **경로 변수**: 
  - `roleKey` (string): 역할 키

**응답 예시:**
```json
{
  "success": true,
  "data": null,
  "message": "역할이 삭제되었습니다"
}
```

### 9. 역할에 권한 할당
- **URL**: `POST /roles/{roleId}/permissions`
- **설명**: 역할에 권한을 할당합니다
- **경로 변수**: 
  - `roleId` (long): 역할 ID

**요청 본문:**
```json
["permission1", "permission2", "permission3"]
```

### 10. 역할 권한 업데이트
- **URL**: `PUT /roles/{roleId}/permissions`
- **설명**: 역할의 권한을 전체 업데이트합니다
- **경로 변수**: 
  - `roleId` (long): 역할 ID

### 11. 역할에서 권한 제거
- **URL**: `DELETE /roles/{roleId}/permissions/{permissionKey}`
- **설명**: 역할에서 특정 권한을 제거합니다
- **경로 변수**: 
  - `roleId` (long): 역할 ID
  - `permissionKey` (string): 권한 키

## 권한(Permission) 관리 API

### 1. 모든 권한 조회
- **URL**: `GET /permissions`
- **설명**: 현재 테넌트의 모든 권한을 조회합니다

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
  ]
}
```

### 2. 활성 권한 조회
- **URL**: `GET /permissions/active`
- **설명**: 현재 테넌트의 활성 권한만 조회합니다

### 3. 시스템 권한 조회
- **URL**: `GET /permissions/system`
- **설명**: 현재 테넌트의 시스템 권한을 조회합니다

### 4. 카테고리별 권한 조회
- **URL**: `GET /permissions/category/{category}`
- **설명**: 특정 카테고리의 권한을 조회합니다
- **경로 변수**: 
  - `category` (string): 권한 카테고리

### 5. 권한 검색
- **URL**: `GET /permissions/search?keyword={keyword}`
- **설명**: 키워드로 권한을 검색합니다
- **쿼리 파라미터**: 
  - `keyword` (string): 검색 키워드

### 6. 특정 권한 조회
- **URL**: `GET /permissions/{permissionKey}`
- **설명**: 권한 키로 특정 권한을 조회합니다
- **경로 변수**: 
  - `permissionKey` (string): 권한 키

### 7. 권한 생성
- **URL**: `POST /permissions`
- **설명**: 새로운 권한을 생성합니다

**요청 본문:**
```json
{
  "permissionKey": "report.export",
  "permissionName": "리포트 내보내기",
  "description": "리포트를 내보낼 수 있는 권한",
  "resource": "report",
  "action": "export",
  "category": "REPORT_MANAGEMENT",
  "priority": 50
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "permissionKey": "report.export",
    "permissionName": "리포트 내보내기",
    "description": "리포트를 내보낼 수 있는 권한",
    "tenantKey": "tenant-001",
    "status": "ACTIVE",
    "resource": "report",
    "action": "export",
    "isSystem": false,
    "category": "REPORT_MANAGEMENT",
    "priority": 50,
    "createdAt": "2025-01-20T10:30:00Z",
    "createdBy": "admin"
  },
  "message": "권한이 생성되었습니다"
}
```

### 8. 권한 수정
- **URL**: `PUT /permissions/{permissionKey}`
- **설명**: 기존 권한을 수정합니다
- **경로 변수**: 
  - `permissionKey` (string): 권한 키

**요청 본문:**
```json
{
  "permissionName": "수정된 리포트 내보내기",
  "description": "수정된 리포트 내보내기 권한",
  "resource": "report",
  "action": "export",
  "category": "REPORT_MANAGEMENT",
  "priority": 60
}
```

### 9. 권한 삭제
- **URL**: `DELETE /permissions/{permissionKey}`
- **설명**: 권한을 삭제합니다 (시스템 권한은 삭제 불가)
- **경로 변수**: 
  - `permissionKey` (string): 권한 키

## 테넌트 권한 관리 API

### 1. 테넌트 기본 권한/역할 초기화
- **URL**: `POST /api/v1/tenants/{tenantKey}/init-permissions`
- **설명**: 신규 테넌트의 기본 권한/역할을 초기화합니다
- **권한**: ADMIN 역할 필요
- **경로 변수**: 
  - `tenantKey` (string): 테넌트 키

**응답 예시:**
```json
{
  "success": true,
  "data": null,
  "message": "테넌트 권한/역할이 초기화되었습니다"
}
```

### 2. 테넌트 역할 조회
- **URL**: `GET /api/v1/tenants/{tenantKey}/roles`
- **설명**: 테넌트별 역할 목록을 조회합니다 (캐시 10분)
- **경로 변수**: 
  - `tenantKey` (string): 테넌트 키

### 3. 테넌트 권한 조회
- **URL**: `GET /api/v1/tenants/{tenantKey}/permissions`
- **설명**: 테넌트별 권한 목록을 조회합니다 (캐시 10분)
- **경로 변수**: 
  - `tenantKey` (string): 테넌트 키

### 4. 테넌트 캐시 무효화
- **URL**: `POST /api/v1/tenants/{tenantKey}/cache/evict`
- **설명**: 테넌트의 권한/역할 캐시를 무효화합니다
- **권한**: ADMIN 역할 필요
- **경로 변수**: 
  - `tenantKey` (string): 테넌트 키

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
| `ROLE_NOT_FOUND` | 404 | 역할을 찾을 수 없음 |
| `PERMISSION_NOT_FOUND` | 404 | 권한을 찾을 수 없음 |
| `ROLE_KEY_DUPLICATE` | 409 | 역할 키 중복 |
| `PERMISSION_KEY_DUPLICATE` | 409 | 권한 키 중복 |
| `SYSTEM_ROLE_DELETE_FORBIDDEN` | 403 | 시스템 역할 삭제 불가 |
| `SYSTEM_PERMISSION_DELETE_FORBIDDEN` | 403 | 시스템 권한 삭제 불가 |
| `TENANT_ACCESS_DENIED` | 403 | 테넌트 접근 권한 없음 |
| `INVALID_PERMISSION_KEYS` | 400 | 유효하지 않은 권한 키 |
| `VALIDATION_ERROR` | 400 | 입력 데이터 검증 실패 |

