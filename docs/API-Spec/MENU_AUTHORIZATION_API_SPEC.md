# 메뉴 접근 권한 제어 시스템 API 스펙

## 개요

AgenticCP 플랫폼의 메뉴 시스템에 RBAC 기반 접근 권한 제어를 구현한 시스템입니다. 사용자의 역할과 권한에 따라 동적으로 메뉴 구조를 필터링하고, 권한이 없는 메뉴 항목은 숨기거나 비활성화하여 보안을 강화합니다.

## 기본 정보

- **Base URL**: `/api/v1/menus`
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

## 메뉴 조회 API

### 1. 사용자별 접근 가능한 메뉴 조회
- **URL**: `GET /`
- **설명**: 현재 사용자가 접근 가능한 메뉴 목록을 조회합니다
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
      "menuKey": "dashboard",
      "menuName": "대시보드",
      "description": "메인 대시보드",
      "url": "/dashboard",
      "icon": "dashboard",
      "sortOrder": 1,
      "isActive": true,
      "isSystem": false,
      "parentId": null,
      "children": [
        {
          "id": 2,
          "menuKey": "user-management",
          "menuName": "사용자 관리",
          "description": "사용자 관리 메뉴",
          "url": "/users",
          "icon": "users",
          "sortOrder": 1,
          "isActive": true,
          "isSystem": false,
          "parentId": 1,
          "children": []
        }
      ]
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 최상위 메뉴 조회
- **URL**: `GET /root`
- **설명**: 최상위 메뉴 목록을 조회합니다

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "menuKey": "dashboard",
      "menuName": "대시보드",
      "description": "메인 대시보드",
      "url": "/dashboard",
      "icon": "dashboard",
      "sortOrder": 1,
      "isActive": true,
      "isSystem": false,
      "parentId": null,
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z"
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 3. 하위 메뉴 조회
- **URL**: `GET /parent/{parentId}`
- **설명**: 특정 부모 메뉴의 하위 메뉴 목록을 조회합니다

**경로 변수**:
- `parentId` (long, required): 부모 메뉴 ID

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "menuKey": "user-management",
      "menuName": "사용자 관리",
      "description": "사용자 관리 메뉴",
      "url": "/users",
      "icon": "users",
      "sortOrder": 1,
      "isActive": true,
      "isSystem": false,
      "parentId": 1,
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:00:00Z"
    }
  ],
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 4. 메뉴 상세 조회
- **URL**: `GET /{menuId}`
- **설명**: 특정 메뉴의 상세 정보를 조회합니다

**경로 변수**:
- `menuId` (long, required): 메뉴 ID

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "menuKey": "dashboard",
    "menuName": "대시보드",
    "description": "메인 대시보드",
    "url": "/dashboard",
    "icon": "dashboard",
    "sortOrder": 1,
    "isActive": true,
    "isSystem": false,
    "parentId": null,
    "permissions": [
      {
        "id": 1,
        "permissionKey": "dashboard.read",
        "permissionName": "대시보드 조회",
        "accessType": "READ",
        "accessTypeDescription": "조회"
      }
    ],
    "createdAt": "2025-01-20T10:00:00Z",
    "updatedAt": "2025-01-20T10:00:00Z"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 메뉴 관리 API (관리자용)

### 1. 메뉴 생성
- **URL**: `POST /`
- **설명**: 새로운 메뉴를 생성합니다 (관리자 권한 필요)
- **권한**: ADMIN 역할 필요

**요청 본문:**
```json
{
  "menuKey": "new-menu",
  "menuName": "새 메뉴",
  "description": "새로 생성된 메뉴",
  "url": "/new-menu",
  "icon": "new-icon",
  "parentId": 1,
  "sortOrder": 10,
  "isSystem": false
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "menuKey": "new-menu",
    "menuName": "새 메뉴",
    "description": "새로 생성된 메뉴",
    "url": "/new-menu",
    "icon": "new-icon",
    "sortOrder": 10,
    "isActive": true,
    "isSystem": false,
    "parentId": 1,
    "createdAt": "2025-01-20T10:30:00Z",
    "updatedAt": "2025-01-20T10:30:00Z"
  },
  "message": "메뉴가 성공적으로 생성되었습니다.",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 메뉴 수정
- **URL**: `PUT /{menuId}`
- **설명**: 기존 메뉴를 수정합니다 (관리자 권한 필요)
- **권한**: ADMIN 역할 필요

**경로 변수**:
- `menuId` (long, required): 메뉴 ID

**요청 본문:**
```json
{
  "menuKey": "updated-menu",
  "menuName": "수정된 메뉴",
  "description": "수정된 메뉴 설명",
  "url": "/updated-menu",
  "icon": "updated-icon",
  "parentId": 1,
  "sortOrder": 5,
  "isActive": true
}
```

### 3. 메뉴 삭제
- **URL**: `DELETE /{menuId}`
- **설명**: 메뉴를 삭제합니다 (관리자 권한 필요)
- **권한**: ADMIN 역할 필요

**경로 변수**:
- `menuId` (long, required): 메뉴 ID

**응답 예시:**
```json
{
  "success": true,
  "data": null,
  "message": "메뉴가 성공적으로 삭제되었습니다.",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 메뉴 권한 관리 API (관리자용)

### 1. 메뉴 권한 할당
- **URL**: `POST /{menuId}/permissions`
- **설명**: 메뉴에 권한을 할당합니다 (관리자 권한 필요)
- **권한**: ADMIN 역할 필요

**경로 변수**:
- `menuId` (long, required): 메뉴 ID

**요청 본문:**
```json
{
  "permissionId": 1,
  "accessType": "READ"
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "menuId": 1,
    "permissionId": 1,
    "permissionKey": "dashboard.read",
    "permissionName": "대시보드 조회",
    "accessType": "READ",
    "accessTypeDescription": "조회",
    "createdAt": "2025-01-20T10:30:00Z"
  },
  "message": "메뉴 권한이 성공적으로 할당되었습니다.",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

### 2. 메뉴 권한 제거
- **URL**: `DELETE /{menuId}/permissions/{permissionId}`
- **설명**: 메뉴에서 권한을 제거합니다 (관리자 권한 필요)
- **권한**: ADMIN 역할 필요

**경로 변수**:
- `menuId` (long, required): 메뉴 ID
- `permissionId` (long, required): 권한 ID

**응답 예시:**
```json
{
  "success": true,
  "data": null,
  "message": "메뉴 권한이 성공적으로 제거되었습니다.",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 메뉴 접근 권한 검증 API

### 1. 메뉴 접근 권한 확인
- **URL**: `GET /api/v1/security/menu/access?menuKey={menuKey}&accessType={accessType}`
- **설명**: 특정 메뉴에 대한 접근 권한을 확인합니다

**쿼리 파라미터**:
- `menuKey` (string, required): 메뉴 키
- `accessType` (string, optional): 접근 타입 (READ, WRITE, DELETE)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "menuKey": "dashboard",
    "accessType": "READ"
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## 커스텀 어노테이션

### 1. @MenuAccess

**용도**: 메뉴 접근 권한을 검증하는 어노테이션

**사용법**:
```java
@MenuAccess(menuKey = "user-management", accessType = MenuPermission.AccessType.READ)
public ResponseEntity<UserDto> getUserManagementMenu() {
    // 구현
}

@MenuAccess(menuKey = "admin-panel", accessType = MenuPermission.AccessType.WRITE, throwOnAccessDenied = false)
public ResponseEntity<AdminDto> getAdminPanel() {
    // 구현
}
```

**속성**:
- `menuKey` (string, required): 메뉴 키
- `accessType` (AccessType, default: READ): 접근 타입 (READ, WRITE, DELETE)
- `throwOnAccessDenied` (boolean, default: true): 권한 없을 때 예외 발생 여부

## 데이터 모델

### Menu (메뉴)
```json
{
  "id": "number",
  "menuKey": "string (2-50자, 테넌트 내 유일)",
  "menuName": "string (2-100자)",
  "description": "string (최대 500자)",
  "url": "string (최대 200자)",
  "icon": "string (최대 50자)",
  "sortOrder": "number",
  "isActive": "boolean",
  "isSystem": "boolean",
  "parentId": "number (nullable)",
  "permissions": "MenuPermission[]",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### MenuPermission (메뉴 권한)
```json
{
  "id": "number",
  "menuId": "number",
  "permissionId": "number",
  "permissionKey": "string",
  "permissionName": "string",
  "accessType": "READ | WRITE | DELETE",
  "accessTypeDescription": "string",
  "createdAt": "datetime"
}
```

## 에러 코드

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| `MENU_NOT_FOUND` | 404 | 메뉴를 찾을 수 없음 |
| `MENU_KEY_DUPLICATE` | 409 | 메뉴 키 중복 |
| `SYSTEM_MENU_DELETE_FORBIDDEN` | 403 | 시스템 메뉴 삭제 불가 |
| `MENU_ACCESS_DENIED` | 403 | 메뉴 접근 권한 없음 |
| `INVALID_MENU_HIERARCHY` | 400 | 잘못된 메뉴 계층 구조 |
| `MENU_PERMISSION_NOT_FOUND` | 404 | 메뉴 권한을 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 입력 데이터 검증 실패 |
