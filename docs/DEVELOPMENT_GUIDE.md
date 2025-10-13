# 개발 가이드

## 📋 개발 환경 설정

### 1. 프로젝트 클론 및 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd AgenticCP-Web

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값 설정
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속

## 🏗️ 개발 워크플로우

### 1. 브랜치 전략

```
main (프로덕션)
  ├── develop (개발)
  │   ├── feature/기능명
  │   ├── bugfix/버그명
  │   └── refactor/리팩토링명
  └── hotfix/긴급수정
```

### 2. 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무, 패키지 매니저 설정 등
```

예시:
```
feat: 테넌트 관리 페이지 추가
fix: 로그인 시 토큰 저장 오류 수정
docs: README에 설치 가이드 추가
```

### 3. Pull Request 절차

1. 기능 브랜치 생성
2. 개발 및 테스트
3. 코드 리뷰 요청
4. 리뷰 반영
5. develop 브랜치로 머지

## 🎨 코딩 컨벤션

### TypeScript/React 컴포넌트

```typescript
// ✅ 좋은 예
import { useState } from 'react';
import { Button } from 'antd';

interface UserListProps {
  users: User[];
  onUserClick: (userId: number) => void;
}

const UserList = ({ users, onUserClick }: UserListProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleClick = (userId: number) => {
    setSelectedId(userId);
    onUserClick(userId);
  };

  return (
    <div>
      {users.map((user) => (
        <Button key={user.id} onClick={() => handleClick(user.id)}>
          {user.name}
        </Button>
      ))}
    </div>
  );
};

export default UserList;
```

### API 서비스

```typescript
// src/services/exampleService.ts
import { apiRequest } from './api';
import { Example, PagedResponse, PaginationParams } from '@/types';

export const exampleService = {
  getList: (params?: PaginationParams): Promise<PagedResponse<Example>> => {
    return apiRequest.get<PagedResponse<Example>>('/api/v1/examples', { params });
  },

  getById: (id: number): Promise<Example> => {
    return apiRequest.get<Example>(`/api/v1/examples/${id}`);
  },

  create: (data: Partial<Example>): Promise<Example> => {
    return apiRequest.post<Example>('/api/v1/examples', data);
  },

  update: (id: number, data: Partial<Example>): Promise<Example> => {
    return apiRequest.put<Example>(`/api/v1/examples/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/examples/${id}`);
  },
};
```

### 상태 관리 (Zustand)

```typescript
// src/store/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  count: number;
  items: string[];
  increment: () => void;
  addItem: (item: string) => void;
  reset: () => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  items: [],
  
  increment: () => set((state) => ({ count: state.count + 1 })),
  
  addItem: (item: string) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  
  reset: () => set({ count: 0, items: [] }),
}));
```

### 커스텀 훅

```typescript
// src/hooks/useExample.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exampleService } from '@/services/exampleService';
import { message } from 'antd';

export const useExamples = () => {
  return useQuery({
    queryKey: ['examples'],
    queryFn: () => exampleService.getList(),
  });
};

export const useCreateExample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exampleService.create,
    onSuccess: () => {
      message.success('생성되었습니다');
      queryClient.invalidateQueries({ queryKey: ['examples'] });
    },
    onError: (error) => {
      message.error('생성에 실패했습니다');
      console.error(error);
    },
  });
};
```

## 🧪 테스트

### 단위 테스트 (추후 추가 예정)

```bash
npm run test
```

### E2E 테스트 (추후 추가 예정)

```bash
npm run test:e2e
```

## 📦 빌드 및 배포

### 개발 환경 빌드

```bash
npm run build
```

### 프로덕션 빌드

```bash
NODE_ENV=production npm run build
```

### 빌드 결과 미리보기

```bash
npm run preview
```

## 🐛 디버깅

### 1. React DevTools

Chrome 확장 프로그램 설치
- React Developer Tools
- Redux DevTools (Redux 사용 시)

### 2. VSCode 디버깅

`.vscode/launch.json` 설정:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### 3. 네트워크 디버깅

브라우저 개발자 도구의 Network 탭 활용
- API 요청/응답 확인
- 에러 응답 확인
- 성능 분석

## 🔧 트러블슈팅

### 포트 충돌

```bash
# 다른 포트로 실행
npm run dev -- --port 3001
```

### 캐시 문제

```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# Vite 캐시 삭제
rm -rf node_modules/.vite
```

### TypeScript 에러

```bash
# 타입 체크만 실행
npm run type-check
```

## 📚 참고 자료

### 공식 문서
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)
- [Ant Design 공식 문서](https://ant.design/)
- [TanStack Query 공식 문서](https://tanstack.com/query)
- [Zustand 공식 문서](https://github.com/pmndrs/zustand)

### 내부 문서
- [프로젝트 구조](./PROJECT_STRUCTURE.md)
- [백엔드 API 가이드](../../AgenticCP-Core/docs/API_DESIGN_GUIDELINES.md)
- [도메인 아키텍처](../../AgenticCP-Core/docs/DOMAIN_ARCHITECTURE.md)

## 💡 베스트 프랙티스

### 1. 컴포넌트 설계
- 단일 책임 원칙 (SRP) 준수
- Props 최소화
- 재사용 가능하게 설계
- 적절한 추상화 레벨 유지

### 2. 성능 최적화
- React.memo() 활용
- useMemo(), useCallback() 적절히 사용
- 큰 리스트는 가상화 (react-window)
- 이미지 최적화 (lazy loading)

### 3. 에러 처리
- ErrorBoundary 활용
- try-catch 블록 사용
- 사용자 친화적인 에러 메시지
- 에러 로깅

### 4. 보안
- XSS 공격 방지
- CSRF 토큰 사용
- 민감 정보 노출 주의
- API 키는 환경 변수로 관리

### 5. 접근성 (a11y)
- 시맨틱 HTML 사용
- ARIA 속성 활용
- 키보드 네비게이션 지원
- 색상 대비 고려

## 🤝 코드 리뷰 체크리스트

- [ ] 코드가 일관된 스타일을 따르는가?
- [ ] 불필요한 콘솔 로그가 없는가?
- [ ] 에러 처리가 적절한가?
- [ ] TypeScript 타입이 명확하게 정의되었는가?
- [ ] 성능 이슈가 없는가?
- [ ] 테스트 코드가 작성되었는가?
- [ ] 문서화가 필요한 부분이 있는가?

## 📞 문의

팀 내부 채널 또는 이슈 트래커를 통해 문의해주세요.

---

**Happy Coding! 🚀**

