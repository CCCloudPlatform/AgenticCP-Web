# API 통합 가이드

## 📋 개요

AgenticCP-Web과 백엔드 API의 통합 방법을 설명합니다.

## 🔗 API 설정

### 환경 변수

`.env` 파일에서 API 기본 설정을 관리합니다:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=30000
```

### Axios 인스턴스

`src/services/api.ts`에서 중앙 집중식 API 클라이언트를 관리합니다:

```typescript
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🔐 인증

### JWT 토큰 관리

#### 요청 인터셉터
모든 요청에 자동으로 JWT 토큰을 포함합니다:

```typescript
api.interceptors.request.use((config) => {
  const token = storage.get<string>(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### 응답 인터셉터
401 에러 시 자동으로 토큰을 갱신합니다:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data;
      storage.set(STORAGE_KEYS.TOKEN, token);
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

## 📡 API 서비스 패턴

### 기본 CRUD 패턴

```typescript
// src/services/resourceService.ts
import { apiRequest } from './api';
import { Resource, PagedResponse, PaginationParams } from '@/types';

export const resourceService = {
  // 목록 조회
  getList: (params?: PaginationParams): Promise<PagedResponse<Resource>> => {
    return apiRequest.get<PagedResponse<Resource>>('/api/v1/resources', { params });
  },

  // 단일 조회
  getById: (id: number): Promise<Resource> => {
    return apiRequest.get<Resource>(`/api/v1/resources/${id}`);
  },

  // 생성
  create: (data: Partial<Resource>): Promise<Resource> => {
    return apiRequest.post<Resource>('/api/v1/resources', data);
  },

  // 수정
  update: (id: number, data: Partial<Resource>): Promise<Resource> => {
    return apiRequest.put<Resource>(`/api/v1/resources/${id}`, data);
  },

  // 부분 수정
  patch: (id: number, data: Partial<Resource>): Promise<Resource> => {
    return apiRequest.patch<Resource>(`/api/v1/resources/${id}`, data);
  },

  // 삭제
  delete: (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/resources/${id}`);
  },
};
```

## 🎣 React Query 통합

### 데이터 조회 (useQuery)

```typescript
import { useQuery } from '@tanstack/react-query';
import { resourceService } from '@/services/resourceService';

export const useResources = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => resourceService.getList(params),
    staleTime: 5 * 60 * 1000, // 5분
    retry: 1,
  });
};

// 컴포넌트에서 사용
const ResourceList = () => {
  const { data, isLoading, error } = useResources({ page: 0, size: 20 });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.content.map((resource) => (
        <div key={resource.id}>{resource.name}</div>
      ))}
    </div>
  );
};
```

### 데이터 변경 (useMutation)

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resourceService.create,
    onSuccess: () => {
      message.success('생성되었습니다');
      // 캐시 무효화하여 목록 재조회
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error) => {
      message.error('생성에 실패했습니다');
      console.error(error);
    },
  });
};

// 컴포넌트에서 사용
const CreateResourceForm = () => {
  const createMutation = useCreateResource();

  const handleSubmit = (values: Partial<Resource>) => {
    createMutation.mutate(values);
  };

  return (
    <Form onFinish={handleSubmit}>
      {/* 폼 필드 */}
      <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
        생성
      </Button>
    </Form>
  );
};
```

## 🔄 페이지네이션

### 백엔드 API 응답 형식

```typescript
interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

### 페이지네이션 구현

```typescript
import { useState } from 'react';
import { Table } from 'antd';

const ResourceListPage = () => {
  const [pagination, setPagination] = useState({ page: 0, size: 20 });
  const { data, isLoading } = useResources(pagination);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '이름', dataIndex: 'name', key: 'name' },
    // ...
  ];

  return (
    <Table
      columns={columns}
      dataSource={data?.content}
      loading={isLoading}
      pagination={{
        current: (data?.page ?? 0) + 1, // 백엔드는 0부터, Ant Design은 1부터
        pageSize: data?.size,
        total: data?.totalElements,
        onChange: (page, pageSize) => {
          setPagination({ page: page - 1, size: pageSize });
        },
      }}
    />
  );
};
```

## ⚠️ 에러 처리

### 백엔드 에러 응답 형식

```typescript
interface ErrorResponse {
  code: string;
  message: string;
  details?: string[];
  timestamp: string;
  path?: string;
  method?: string;
}
```

### 에러 처리 예시

```typescript
import { AxiosError } from 'axios';
import { message } from 'antd';

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse;
    
    switch (error.response?.status) {
      case 400:
        message.error(errorData?.message || '잘못된 요청입니다');
        break;
      case 401:
        message.error('인증이 필요합니다');
        // 로그인 페이지로 리다이렉트
        break;
      case 403:
        message.error('권한이 없습니다');
        break;
      case 404:
        message.error('리소스를 찾을 수 없습니다');
        break;
      case 500:
        message.error('서버 오류가 발생했습니다');
        break;
      default:
        message.error(errorData?.message || '오류가 발생했습니다');
    }
  } else {
    message.error('네트워크 오류가 발생했습니다');
  }
};

// 사용 예시
const mutation = useMutation({
  mutationFn: resourceService.create,
  onError: handleApiError,
});
```

## 🔍 필터링 및 검색

### 쿼리 파라미터 전달

```typescript
interface ResourceFilterParams extends PaginationParams {
  status?: string;
  provider?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export const useResourcesWithFilter = (filters: ResourceFilterParams) => {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => resourceService.getList(filters),
  });
};

// 컴포넌트에서 사용
const ResourceListWithFilter = () => {
  const [filters, setFilters] = useState<ResourceFilterParams>({
    page: 0,
    size: 20,
    status: 'ACTIVE',
  });

  const { data, isLoading } = useResourcesWithFilter(filters);

  return (
    <div>
      <Select
        value={filters.status}
        onChange={(status) => setFilters({ ...filters, status, page: 0 })}
      >
        <Option value="ACTIVE">활성</Option>
        <Option value="INACTIVE">비활성</Option>
      </Select>
      
      {/* 리소스 목록 */}
    </div>
  );
};
```

## 🚀 최적화 팁

### 1. 캐싱 전략

```typescript
// 자주 변경되지 않는 데이터는 긴 staleTime 설정
const { data } = useQuery({
  queryKey: ['static-data'],
  queryFn: fetchStaticData,
  staleTime: 30 * 60 * 1000, // 30분
  cacheTime: 60 * 60 * 1000, // 1시간
});

// 실시간 데이터는 짧은 staleTime 또는 refetch 설정
const { data } = useQuery({
  queryKey: ['real-time-data'],
  queryFn: fetchRealTimeData,
  staleTime: 0,
  refetchInterval: 5000, // 5초마다 갱신
});
```

### 2. Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// 마우스 오버 시 데이터 미리 로드
const handleMouseEnter = (id: number) => {
  queryClient.prefetchQuery({
    queryKey: ['resource', id],
    queryFn: () => resourceService.getById(id),
  });
};
```

### 3. Optimistic Update

```typescript
const mutation = useMutation({
  mutationFn: resourceService.update,
  onMutate: async (updatedResource) => {
    // 이전 데이터 백업
    await queryClient.cancelQueries({ queryKey: ['resources'] });
    const previousResources = queryClient.getQueryData(['resources']);

    // 낙관적 업데이트
    queryClient.setQueryData(['resources'], (old: any) => ({
      ...old,
      content: old.content.map((r: Resource) =>
        r.id === updatedResource.id ? { ...r, ...updatedResource } : r
      ),
    }));

    return { previousResources };
  },
  onError: (err, updatedResource, context) => {
    // 에러 시 이전 데이터로 롤백
    queryClient.setQueryData(['resources'], context?.previousResources);
  },
  onSettled: () => {
    // 완료 후 다시 조회
    queryClient.invalidateQueries({ queryKey: ['resources'] });
  },
});
```

## 📝 체크리스트

API 통합 시 확인사항:
- [ ] 환경 변수 설정 (.env)
- [ ] API 베이스 URL 확인
- [ ] 인증 토큰 처리
- [ ] 에러 핸들링
- [ ] 타입 정의
- [ ] 캐싱 전략
- [ ] 로딩 상태 처리
- [ ] 페이지네이션 구현

---

백엔드 API 명세는 [API Design Guidelines](../../AgenticCP-Core/docs/API_DESIGN_GUIDELINES.md)를 참조하세요.

