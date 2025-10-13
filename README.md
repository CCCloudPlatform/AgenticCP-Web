# AgenticCP Web Console

멀티클라우드 플랫폼의 웹 콘솔 프로젝트입니다.

## 📋 프로젝트 개요

AgenticCP-Web은 AWS, GCP, Azure 등 다양한 클라우드 리소스를 통합 관리하는 멀티클라우드 플랫폼의 프론트엔드 애플리케이션입니다.

## 🏗️ 기술 스택

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: SCSS
- **Code Quality**: ESLint, Prettier

## 📁 프로젝트 구조

```
AgenticCP-Web/
├── src/
│   ├── assets/              # 정적 리소스 (이미지, 폰트 등)
│   ├── components/          # 공통 컴포넌트
│   │   ├── common/          # 범용 컴포넌트
│   │   └── layout/          # 레이아웃 컴포넌트
│   ├── constants/           # 상수 정의
│   ├── hooks/               # 커스텀 훅
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── auth/            # 인증 관련
│   │   ├── dashboard/       # 대시보드
│   │   ├── tenants/         # 테넌트 관리
│   │   ├── cloud/           # 클라우드 리소스
│   │   ├── orchestration/   # 오케스트레이션
│   │   ├── monitoring/      # 모니터링
│   │   ├── security/        # 보안 & 컴플라이언스
│   │   ├── cost/            # 비용 관리
│   │   ├── iac/             # Infrastructure as Code
│   │   ├── integration/     # 통합 & API
│   │   ├── notifications/   # 알림
│   │   ├── settings/        # 설정
│   │   └── error/           # 에러 페이지
│   ├── routes/              # 라우팅 설정
│   ├── services/            # API 서비스
│   ├── store/               # 전역 상태 관리
│   ├── styles/              # 전역 스타일
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 유틸리티 함수
│   ├── App.tsx              # 앱 루트 컴포넌트
│   └── main.tsx             # 앱 진입점
├── public/                  # 공개 정적 파일
├── .eslintrc.cjs            # ESLint 설정
├── .prettierrc              # Prettier 설정
├── tsconfig.json            # TypeScript 설정
├── vite.config.ts           # Vite 설정
└── package.json             # 프로젝트 의존성
```

## 🚀 시작하기

### 사전 요구사항

**로컬 개발:**
- Node.js 20.0.0 이상 (LTS 버전 권장)
- npm 10.0.0 이상

**Docker 개발 (권장):**
- Docker 20.10 이상
- Docker Compose 1.29 이상

### 방법 1: Docker를 사용한 개발 (권장) 🐳

Docker를 사용하면 일관된 개발 환경을 쉽게 구축할 수 있습니다.

#### 빠른 시작

```bash
# 1. 개발 환경 시작
./scripts/docker-dev.sh

# 또는 직접 docker-compose 실행
docker-compose up --build
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

#### Docker 명령어

```bash
# 개발 서버 시작
./scripts/docker-dev.sh
# 또는
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 컨테이너 중지
./scripts/docker-stop.sh
# 또는
docker-compose down

# 캐시 없이 재빌드
./scripts/docker-rebuild.sh

# 환경 완전 정리 (컨테이너, 볼륨, 이미지 삭제)
./scripts/docker-clean.sh

# 로그 확인
docker-compose logs -f agenticcp-web

# 컨테이너 내부 접속
docker exec -it agenticcp-web-dev sh
```

#### Docker 개발 환경 특징

- ✅ **자동 리로드**: 파일 변경 시 자동으로 반영 (Hot Module Replacement)
- ✅ **일관된 환경**: 모든 개발자가 동일한 Node.js 버전 사용
- ✅ **간편한 설정**: 복잡한 로컬 환경 설정 불필요
- ✅ **백엔드 연동**: Docker 네트워크를 통한 쉬운 백엔드 통합

#### 백엔드와 함께 실행

백엔드(AgenticCP-Core)와 함께 실행하려면:

```bash
# 1. 백엔드 프로젝트로 이동하여 Docker 네트워크 생성 및 실행
cd ../AgenticCP-Core
docker-compose up -d

# 2. 프론트엔드 실행
cd ../AgenticCP-Web
./scripts/docker-dev.sh
```

Docker 네트워크 `agenticcp-network`를 통해 자동으로 연결됩니다.

### 방법 2: 로컬 개발

#### 설치

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 설정합니다.

```bash
cp .env.example .env
```

#### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 http://localhost:3000 에서 실행됩니다.

#### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

#### 프리뷰

```bash
npm run preview
```

### 프로덕션 배포

#### Docker를 사용한 프로덕션 빌드

```bash
# 프로덕션 이미지 빌드
docker build -t agenticcp-web:latest .

# 프로덕션 컨테이너 실행
docker run -p 80:80 agenticcp-web:latest

# 또는 docker-compose 사용
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 주요 기능

### 1. Platform Management (플랫폼 관리)
- 플랫폼 설정 관리
- 기능 플래그 관리
- 라이선스 관리
- 플랫폼 상태 모니터링

### 2. Tenant Management (테넌트 관리)
- 멀티 테넌트 지원
- 테넌트별 데이터 격리
- 테넌트 설정 관리

### 3. Cloud Management (클라우드 관리)
- AWS, GCP, Azure 프로바이더 연동
- 클라우드 리소스 통합 관리
- 리소스 인벤토리 관리

### 4. Resource Orchestration (리소스 오케스트레이션)
- 자동화된 배포 관리
- 오토 스케일링
- 워크플로우 자동화

### 5. Monitoring & Analytics (모니터링 & 분석)
- 실시간 메트릭 수집
- 로그 관리
- 알림 시스템
- 커스텀 대시보드

### 6. Security & Compliance (보안 & 컴플라이언스)
- RBAC 기반 권한 관리
- 사용자 및 역할 관리
- 보안 정책 관리

### 7. Cost Management (비용 관리)
- 클라우드 비용 추적
- 예산 관리
- 비용 최적화 제안

### 8. Infrastructure as Code (IaC)
- Terraform 템플릿 관리
- 배포 파이프라인

### 9. Integration & API (통합 & API)
- API 게이트웨이
- 웹훅 관리
- 서드파티 통합

### 10. AI Agent Chat 🤖
- **자연어 명령 처리**: 복잡한 UI 조작 없이 자연어로 명령 실행
- **실시간 채팅**: Agent와의 실시간 대화 인터페이스
- **명령 실행 결과**: 실행된 작업과 결과를 시각적으로 표시
- **대화 히스토리**: 이전 대화 내용 저장 및 관리
- **명령 팔레트**: 자주 사용하는 명령어 빠른 실행

#### 사용 예시
```
사용자: "AWS EC2 인스턴스 목록을 보여줘"
Agent: "현재 실행 중인 EC2 인스턴스는 5개입니다..."

사용자: "이번 달 AWS 비용 분석해줘"
Agent: "이번 달 총 비용은 $1,234입니다. 주요 비용..."
```

## 🔐 인증 및 권한

### 사용자 역할

- **Super Admin**: 모든 기능 접근 가능
- **Tenant Admin**: 테넌트 내 모든 기능 관리
- **Cloud Admin**: 클라우드 리소스 관리
- **Developer**: 개발 관련 기능 사용
- **Viewer**: 조회 권한만 보유
- **Auditor**: 감사 및 로그 조회

### 인증 방식

- JWT 기반 토큰 인증
- Refresh Token을 통한 자동 갱신
- 로컬 스토리지를 이용한 세션 유지

## 🎨 코드 스타일

프로젝트는 다음 도구를 사용하여 코드 품질을 관리합니다:

- **ESLint**: 코드 린팅
- **Prettier**: 코드 포맷팅

### 코드 포맷팅

```bash
# 코드 포맷팅 검사
npm run format:check

# 코드 포맷팅 자동 수정
npm run format
```

### 린팅

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix
```

## 🔧 개발 가이드

### 컴포넌트 작성 규칙

1. 함수형 컴포넌트 사용
2. TypeScript 타입 정의
3. Props 인터페이스 명시
4. 적절한 주석 작성

```typescript
interface MyComponentProps {
  title: string;
  onSubmit: () => void;
}

const MyComponent = ({ title, onSubmit }: MyComponentProps) => {
  // 컴포넌트 로직
  return <div>{title}</div>;
};

export default MyComponent;
```

### API 호출 패턴

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { tenantService } from '@/services/tenantService';

// 데이터 조회
const { data, isLoading, error } = useQuery({
  queryKey: ['tenants'],
  queryFn: () => tenantService.getTenants(),
});

// 데이터 변경
const mutation = useMutation({
  mutationFn: tenantService.createTenant,
  onSuccess: () => {
    // 성공 처리
  },
});
```

### 상태 관리 패턴

```typescript
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## 📖 참고 문서

- [백엔드 API 설계 가이드라인](../AgenticCP-Core/docs/API_DESIGN_GUIDELINES.md)
- [도메인 아키텍처](../AgenticCP-Core/docs/DOMAIN_ARCHITECTURE.md)
- [개발 표준](../AgenticCP-Core/docs/DEVELOPMENT_STANDARDS.md)

## 🐛 트러블슈팅

### Docker 관련

**문제: 포트 충돌**
```bash
# 다른 포트 사용
docker-compose down
# docker-compose.yml에서 포트 변경 후
docker-compose up
```

**문제: 변경사항이 반영되지 않음**
```bash
# Docker 볼륨 및 컨테이너 재시작
docker-compose down -v
docker-compose up --build
```

**문제: 네트워크 연결 실패**
```bash
# Docker 네트워크 재생성
docker network rm agenticcp-network
docker network create agenticcp-network
```

**문제: 권한 오류 (Permission denied)**
```bash
# 스크립트 실행 권한 부여
chmod +x scripts/*.sh
```

### 로컬 개발 관련

**문제: node_modules 충돌**
```bash
rm -rf node_modules package-lock.json
npm install
```

**문제: Vite 캐시 문제**
```bash
rm -rf node_modules/.vite
npm run dev
```

## 🤝 기여하기

1. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
2. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
3. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
4. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 팀

AgenticCP 개발팀

---

**Built with ❤️ by AgenticCP Team**
