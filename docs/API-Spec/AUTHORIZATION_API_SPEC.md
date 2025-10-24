# 권한 검증 미들웨어 및 AOP API 스펙

## 개요

Spring AOP와 커스텀 어노테이션을 활용한 자동 권한 검증 시스템 API입니다. 모든 API 엔드포인트에서 일관된 권한 검증과 접근 제어를 제공하며, 테넌트별 권한 격리와 권한 캐싱을 통해 성능을 최적화합니다.

## 기본 정보

- **Base URL**: `/api/v1/security`
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

## 권한 검증 API

### 1. 권한 확인
- **URL**: `GET /check/permission?permissionKey={permissionKey}`
- **설명**: 현재 사용자가 특정 권한을 가지고 있는지 확인합니다
- **헤더**: 
  - `Authorization: Bearer {token}`
  - `X-Tenant-Key: {tenantKey}`

**쿼리 파라미터**:
- `permissionKey` (string, required): 확인할 권한 키

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "hasPermission": true
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 역할 확인
- **URL**: `GET /check/role?roleKey={roleKey}`
- **설명**: 현재 사용자가 특정 역할을 가지고 있는지 확인합니다

**쿼리 파라미터**:
- `roleKey` (string, required): 확인할 역할 키

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "hasRole": true
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 테넌트 권한 검증 API

### 1. 테넌트 접근 권한 검증
- **URL**: `POST /tenant/validate`
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

## 사용자 정보 API

### 1. 현재 사용자 정보 조회
- **URL**: `GET /me`
- **설명**: 현재 인증된 사용자의 기본 정보를 조회합니다

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "username": "admin"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 사용자 권한 목록 조회
- **URL**: `GET /me/permissions`
- **설명**: 현재 사용자가 가지고 있는 모든 권한 목록을 조회합니다

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      "user.read",
      "user.write",
      "admin.manage"
    ]
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 권한 캐시 관리 API

### 1. 권한 캐시 무효화
- **URL**: `POST /cache/permissions/evict`
- **설명**: 특정 사용자의 권한 캐시를 무효화합니다

**요청 본문:**
```json
{
  "username": "admin"
}
```

**응답**: `204 No Content`

### 2. 권한 캐시 워밍업
- **URL**: `POST /cache/permissions/warm`
- **설명**: 특정 사용자의 권한 정보를 캐시에 미리 로드합니다

**요청 본문:**
```json
{
  "username": "admin"
}
```

**응답**: `204 No Content`

## 테스트용 보호된 API

### 1. 권한 기반 보호 API
- **URL**: `GET /_test/protected/permission`
- **설명**: `@RequirePermission("sample.permission")` 어노테이션이 적용된 테스트 API입니다
- **권한 요구사항**: `sample.permission` 권한 필요

**응답 예시:**
```json
{
  "success": true,
  "data": "OK",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 역할 기반 보호 API
- **URL**: `GET /_test/protected/role`
- **설명**: `@RequireRole({"TESTER"})` 어노테이션이 적용된 테스트 API입니다
- **권한 요구사항**: `TESTER` 역할 필요

**응답 예시:**
```json
{
  "success": true,
  "data": "OK",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 3. PreAuthorize 기반 보호 API
- **URL**: `GET /_test/protected/preauthorize`
- **설명**: `@PreAuthorize("hasAnyRole('ADMIN','AUDITOR')")` 어노테이션이 적용된 테스트 API입니다
- **권한 요구사항**: `ADMIN` 또는 `AUDITOR` 역할 중 하나 필요

**응답 예시:**
```json
{
  "success": true,
  "data": "OK",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 커스텀 어노테이션

### 1. @RequirePermission

**용도**: 특정 권한을 가진 사용자만 접근할 수 있도록 제한

**사용법**:
```java
@RequirePermission("user.read")
public ResponseEntity<User> getUser(Long id) {
    // 구현
}

@RequirePermission(value = "user.write", resource = "user", action = "update")
public ResponseEntity<User> updateUser(Long id, UserDto userDto) {
    // 구현
}
```

**속성**:
- `value` (string, required): 권한 키
- `resource` (string, optional): 리소스 타입
- `action` (string, optional): 액션 타입

### 2. @RequireRole

**용도**: 특정 역할을 가진 사용자만 접근할 수 있도록 제한

**사용법**:
```java
@RequireRole({"ADMIN"})
public ResponseEntity<List<User>> getAllUsers() {
    // 구현
}

@RequireRole(value = {"ADMIN", "MANAGER"}, requireAll = false)
public ResponseEntity<List<User>> getUsersByRole() {
    // 구현
}
```

**속성**:
- `value` (string[], required): 필요한 역할 목록
- `requireAll` (boolean, default: false): 모든 역할이 필요한지 여부

### 3. @MenuAccess

**용도**: 메뉴 접근 권한을 검증

**사용법**:
```java
@MenuAccess(menuKey = "user-management", accessType = MenuPermission.AccessType.READ)
public ResponseEntity<MenuDto> getUserManagementMenu() {
    // 구현
}
```

**속성**:
- `menuKey` (string, required): 메뉴 키
- `accessType` (AccessType, default: READ): 접근 타입 (READ, WRITE, DELETE)
- `throwOnAccessDenied` (boolean, default: true): 권한 없을 때 예외 발생 여부

## 예외 처리

### 1. AccessDeniedException (403 Forbidden)

권한이 없는 리소스에 접근할 때 발생합니다.

**응답 예시:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "접근 권한이 없습니다",
    "details": null
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. AuthenticationException (401 Unauthorized)

인증되지 않은 사용자가 접근할 때 발생합니다.

**응답 예시:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증되지 않은 사용자입니다",
    "details": null
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 3. AuthorizationException (403 Forbidden)

테넌트 간 권한 접근 시 발생합니다.

**응답 예시:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "해당 테넌트에 대한 접근 권한이 없습니다",
    "details": null
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `FORBIDDEN` | 403 | 접근 권한이 없음 |
| `UNAUTHORIZED` | 401 | 인증되지 않은 사용자 |
| `TENANT_ACCESS_DENIED` | 403 | 테넌트 접근 권한 없음 |
| `PERMISSION_NOT_FOUND` | 404 | 권한을 찾을 수 없음 |
| `ROLE_NOT_FOUND` | 404 | 역할을 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 입력 데이터 검증 실패 |

