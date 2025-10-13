# 개발 모드 가이드

## 🔧 개발 모드란?

백엔드 API 연동 전에 프론트엔드 개발을 진행할 수 있도록 하드코딩된 계정과 Mock 데이터를 제공하는 모드입니다.

## 🔐 하드코딩 계정

백엔드 연동 전까지 사용할 수 있는 슈퍼 관리자 계정입니다.

### 로그인 정보

```
Username: agenticcp
Password: agenticcpwebpw
Role: SUPER_ADMIN
```

### 사용 방법

1. 로그인 페이지 접속
2. 위 계정 정보 입력 (기본값으로 자동 입력됨)
3. 로그인 버튼 클릭

## 🎭 Mock 기능

### 1. 인증 (Authentication)

**하드코딩 계정 로그인:**
- `authService.login()` - 하드코딩 계정 체크
- Mock JWT 토큰 발급
- 슈퍼 관리자 권한 부여

**코드 위치:**
```typescript
// src/services/authService.ts
const DEV_ACCOUNT = {
  username: 'agenticcp',
  password: 'agenticcpwebpw',
};
```

### 2. AI Agent Chat

**Mock 응답:**
- 랜덤 응답 메시지 반환
- 1초 딜레이로 실제 API 시뮬레이션
- 명령 실행 결과 Mock 데이터

**코드 위치:**
```typescript
// src/services/agentService.ts
const MOCK_RESPONSES = [
  "현재 실행 중인 AWS EC2 인스턴스는 5개입니다.",
  "이번 달 AWS 총 비용은 $1,234입니다.",
  // ...
];
```

### 3. API 에러 처리

Mock 토큰 사용 시 API 에러를 무시하여 개발을 계속할 수 있습니다.

## 🚀 개발 워크플로우

### 1. 프론트엔드만 개발

```bash
# 1. 프론트엔드 실행
npm run dev

# 2. 브라우저 접속
# http://localhost:3000

# 3. 하드코딩 계정으로 로그인
# Username: agenticcp
# Password: agenticcpwebpw
```

### 2. 백엔드와 함께 개발

```bash
# 1. 백엔드 실행 (AgenticCP-Core)
cd ../AgenticCP-Core
docker-compose up -d

# 2. 프론트엔드 실행
cd ../AgenticCP-Web
npm run dev

# 3. 실제 계정으로 로그인 또는 하드코딩 계정 사용
```

## 🔄 Mock 모드 전환

### Mock 모드 활성화/비활성화

`src/config/dev.ts` 파일에서 설정:

```typescript
export const DEV_CONFIG = {
  // Mock 모드 활성화
  ENABLE_MOCK: true,  // false로 변경하면 실제 API 호출

  // Mock API 딜레이 (ms)
  MOCK_API_DELAY: 1000,  // 응답 지연 시간 조정

  // 개발 모드 로그
  ENABLE_DEV_LOG: true,  // 콘솔 로그 활성화
};
```

### 환경 변수로 제어

`.env` 파일:

```env
VITE_ENABLE_MOCK_API=true
```

## 📊 Mock 데이터

### 사용자 정보

```typescript
{
  id: 1,
  username: 'agenticcp',
  email: 'admin@agenticcp.com',
  name: 'Super Admin (DEV)',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE',
}
```

### JWT 토큰

```
mock-jwt-token-[timestamp]
mock-refresh-token-[timestamp]
```

## 🐛 디버깅

### 개발 모드 확인

브라우저 콘솔에서 다음 로그 확인:

```
🔓 개발용 하드코딩 계정으로 로그인
🔓 개발용 Mock 사용자 반환
🔓 개발용 Mock Agent 응답
```

### LocalStorage 확인

개발자 도구 > Application > Local Storage:

```
agenticcp_token: mock-jwt-token-...
agenticcp_refresh_token: mock-refresh-token-...
agenticcp_user_info: {...}
```

## ⚠️ 주의사항

### 1. 프로덕션 배포 전 제거

프로덕션 배포 전에 반드시 하드코딩 계정과 Mock 데이터를 제거하세요.

```typescript
// ❌ 제거해야 할 코드
const DEV_ACCOUNT = {
  username: 'agenticcp',
  password: 'agenticcpwebpw',
};
```

### 2. 보안

하드코딩 계정은 **개발 환경에서만** 사용하세요. 절대 프로덕션에 포함시키지 마세요.

### 3. Git 커밋

개발 모드 설정을 Git에 커밋할 때 주의하세요. 민감한 정보가 포함되지 않도록 확인하세요.

## 🔧 커스터마이징

### Mock 응답 추가

Agent Chat Mock 응답을 커스터마이즈할 수 있습니다:

```typescript
// src/services/agentService.ts
const MOCK_RESPONSES = [
  "현재 실행 중인 AWS EC2 인스턴스는 5개입니다.",
  "이번 달 AWS 총 비용은 $1,234입니다.",
  // 새로운 응답 추가
  "커스텀 응답 메시지",
];
```

### 딜레이 조정

API 응답 시간을 조정할 수 있습니다:

```typescript
// src/services/agentService.ts
setTimeout(() => {
  resolve(getMockResponse(request.message));
}, 2000); // 2초로 변경
```

### 추가 Mock 서비스

다른 서비스에도 Mock 기능을 추가할 수 있습니다:

```typescript
// src/services/cloudService.ts
export const cloudService = {
  getResources: () => {
    const token = localStorage.getItem('agenticcp_token');
    if (token?.startsWith('mock-jwt-token')) {
      return Promise.resolve(MOCK_RESOURCES);
    }
    return apiRequest.get('/api/v1/resources');
  },
};
```

## 📝 체크리스트

### 개발 시작 전

- [ ] 하드코딩 계정 정보 확인
- [ ] Mock 모드 활성화 확인
- [ ] 개발 서버 실행
- [ ] 로그인 테스트

### 백엔드 연동 시

- [ ] 실제 계정으로 로그인 테스트
- [ ] API 응답 확인
- [ ] Mock 모드 비활성화 테스트

### 프로덕션 배포 전

- [ ] 하드코딩 계정 제거
- [ ] Mock 응답 제거
- [ ] 개발 모드 로그 제거
- [ ] 환경 변수 확인

## 📚 관련 파일

```
src/
├── config/
│   └── dev.ts              # 개발 모드 설정
├── services/
│   ├── authService.ts      # 인증 Mock
│   ├── agentService.ts     # Agent Chat Mock
│   └── api.ts              # API 인터셉터
└── pages/
    └── auth/
        └── LoginPage.tsx   # 로그인 페이지
```

## 🔗 참고 자료

- [개발 가이드](./DEVELOPMENT_GUIDE.md)
- [API 통합 가이드](./API_INTEGRATION.md)
- [Agent Chat 가이드](./AGENT_CHAT_GUIDE.md)

---

개발 모드를 활용하여 백엔드 연동 전에도 효율적으로 개발하세요! 🚀

