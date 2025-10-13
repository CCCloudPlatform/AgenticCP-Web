# 프로젝트 구조 상세 설명

## 📋 개요

이 문서는 AgenticCP-Web 프로젝트의 폴더 구조와 각 파일의 역할을 상세히 설명합니다.

## 📁 디렉토리 구조

### `/src/assets`
정적 리소스를 관리하는 디렉토리입니다.
- 이미지 파일
- 아이콘
- 폰트 파일
- 기타 정적 자산

### `/src/components`
재사용 가능한 컴포넌트를 관리합니다.

#### `/src/components/common`
범용적으로 사용되는 공통 컴포넌트
- `PageHeader.tsx`: 페이지 헤더 컴포넌트
- `Loading.tsx`: 로딩 인디케이터
- `ErrorBoundary.tsx`: 에러 경계 컴포넌트

#### `/src/components/layout`
레이아웃 관련 컴포넌트
- `MainLayout.tsx`: 메인 레이아웃 (헤더 + 사이드바 + 컨텐츠)
- `Header.tsx`: 상단 헤더
- `Sidebar.tsx`: 사이드바 네비게이션

### `/src/constants`
애플리케이션 전역 상수 정의
- 라우트 경로
- API 엔드포인트
- 스토리지 키
- 사용자 역할
- HTTP 상태 코드

### `/src/hooks`
커스텀 React 훅
- `useAuth.ts`: 인증 관련 훅

### `/src/pages`
페이지 컴포넌트 디렉토리

#### 도메인별 페이지
- `/auth`: 인증 (로그인, 회원가입 등)
- `/dashboard`: 대시보드
- `/tenants`: 테넌트 관리
- `/cloud`: 클라우드 리소스 관리
- `/orchestration`: 리소스 오케스트레이션
- `/monitoring`: 모니터링 & 분석
- `/security`: 보안 & 컴플라이언스
- `/cost`: 비용 관리
- `/iac`: Infrastructure as Code
- `/integration`: 통합 & API
- `/notifications`: 알림
- `/settings`: 설정
- `/error`: 에러 페이지

### `/src/routes`
라우팅 설정
- `index.tsx`: 라우트 정의
- `PrivateRoute.tsx`: 인증이 필요한 라우트 보호

### `/src/services`
API 통신 서비스
- `api.ts`: Axios 인스턴스 및 인터셉터 설정
- `authService.ts`: 인증 API
- `tenantService.ts`: 테넌트 관리 API
- `cloudService.ts`: 클라우드 관리 API
- 기타 도메인별 서비스

### `/src/store`
전역 상태 관리 (Zustand)
- `authStore.ts`: 인증 상태
- 필요에 따라 도메인별 스토어 추가

### `/src/styles`
전역 스타일
- `global.scss`: 전역 CSS 스타일

### `/src/types`
TypeScript 타입 정의
- API 응답 타입
- 도메인 모델 타입
- 공통 타입

### `/src/utils`
유틸리티 함수
- `storage.ts`: 로컬 스토리지 유틸리티
- `format.ts`: 데이터 포맷팅 (날짜, 숫자 등)
- `validator.ts`: 검증 함수

## 🎯 주요 파일 설명

### `vite.config.ts`
Vite 빌드 도구 설정
- 경로 별칭 설정
- 프록시 설정
- 빌드 최적화
- 플러그인 설정

### `tsconfig.json`
TypeScript 컴파일러 설정
- 컴파일러 옵션
- 경로 매핑
- 타입 검사 규칙

### `.eslintrc.cjs`
ESLint 린터 설정
- 코드 스타일 규칙
- React 및 TypeScript 규칙

### `.prettierrc`
Prettier 포맷터 설정
- 코드 포맷 규칙

### `package.json`
프로젝트 메타데이터 및 의존성
- 의존성 패키지
- 스크립트 명령어

## 🔄 데이터 플로우

```
User Action
    ↓
Component (React)
    ↓
Hook (useQuery/useMutation)
    ↓
Service (API Call)
    ↓
Backend API
    ↓
Response
    ↓
Store/Component State
    ↓
UI Update
```

## 📦 모듈 의존성

### 핵심 의존성
- **react**: UI 라이브러리
- **react-dom**: DOM 렌더링
- **react-router-dom**: 라우팅
- **antd**: UI 컴포넌트 라이브러리
- **axios**: HTTP 클라이언트
- **zustand**: 상태 관리
- **@tanstack/react-query**: 서버 상태 관리

### 개발 의존성
- **typescript**: 타입 시스템
- **vite**: 빌드 도구
- **eslint**: 린터
- **prettier**: 포맷터

## 🎨 네이밍 컨벤션

### 파일명
- **컴포넌트**: PascalCase (예: `UserProfile.tsx`)
- **훅**: camelCase with 'use' prefix (예: `useAuth.ts`)
- **유틸리티**: camelCase (예: `formatDate.ts`)
- **상수**: UPPER_SNAKE_CASE (파일명은 camelCase)

### 디렉토리명
- kebab-case 또는 camelCase

## 🔐 환경 변수

환경 변수는 `.env` 파일에 정의하며, Vite에서는 `VITE_` 접두사를 사용합니다.

```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=AgenticCP
```

접근 방법:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 📝 추가 개발 가이드

새로운 도메인 페이지를 추가할 때:

1. `/src/pages/{domain}` 디렉토리 생성
2. `/src/services/{domain}Service.ts` API 서비스 생성
3. `/src/types/index.ts`에 타입 추가
4. `/src/routes/index.tsx`에 라우트 추가
5. `/src/components/layout/Sidebar.tsx`에 메뉴 추가

---

이 문서는 프로젝트 구조가 변경될 때마다 업데이트되어야 합니다.

