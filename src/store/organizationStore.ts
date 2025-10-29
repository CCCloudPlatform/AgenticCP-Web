import { create } from 'zustand';
import { organizationService } from '@/services/organizationService';
import { 
  Organization, 
  OrganizationResponse,
  OrganizationHierarchyResponse,
  OrganizationMember,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  MoveOrganizationRequest,
  AddUserToOrganizationRequest,
  OrganizationStatsResponse
} from '@/types';

interface OrganizationStoreState {
  // 상태
  organizations: OrganizationResponse[];
  organizationTree: OrganizationHierarchyResponse[];
  selectedOrganization: OrganizationResponse | null;
  members: OrganizationMember[];
  stats: OrganizationStatsResponse | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchOrganizations: () => Promise<void>;
  fetchOrganizationTree: () => Promise<void>;
  fetchOrganizationById: (id: number) => Promise<void>;
  selectOrganization: (organization: OrganizationResponse | null) => void;
  createOrganization: (data: CreateOrganizationRequest) => Promise<void>;
  updateOrganization: (id: number, data: UpdateOrganizationRequest) => Promise<void>;
  deleteOrganization: (id: number) => Promise<void>;
  moveOrganization: (id: number, data: MoveOrganizationRequest) => Promise<void>;
  fetchMembers: (organizationId: number) => Promise<void>;
  addMember: (organizationId: number, data: AddUserToOrganizationRequest) => Promise<void>;
  removeMember: (organizationId: number, userId: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useOrganizationStore = create<OrganizationStoreState>((set, get) => ({
  // 초기 상태
  organizations: [],
  organizationTree: [],
  selectedOrganization: null,
  members: [],
  stats: null,
  isLoading: false,
  error: null,

  // 조직 목록 조회
  fetchOrganizations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await organizationService.getOrganizations();
      set({ organizations: response.content, isLoading: false });
    } catch (error) {
      // TODO: API 서버 연결 후 실제 데이터 로드
      // 현재는 더미 데이터로 대체
      console.warn('API 서버 연결 실패, 더미 데이터 사용:', error);
      const dummyOrganizations: OrganizationResponse[] = [
        {
          id: 1,
          orgName: 'AgenticCP 본사',
          description: 'AgenticCP의 본사 조직',
          orgType: 'COMPANY',
          parentId: undefined,
          depth: 0,
          contactEmail: 'contact@agenticcp.com',
          contactPhone: '02-1234-5678',
          address: '서울시 강남구 테헤란로 123',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin',
          updatedBy: 'admin',
          parentName: undefined,
          childrenCount: 3,
          membersCount: 15,
          tenantsCount: 5,
        },
        {
          id: 2,
          orgName: '개발팀',
          description: '소프트웨어 개발을 담당하는 팀',
          orgType: 'TEAM',
          parentId: 1,
          depth: 1,
          contactEmail: 'dev@agenticcp.com',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin',
          updatedBy: 'admin',
          parentName: 'AgenticCP 본사',
          childrenCount: 2,
          membersCount: 8,
          tenantsCount: 2,
        },
        {
          id: 3,
          orgName: '마케팅팀',
          description: '마케팅 및 홍보를 담당하는 팀',
          orgType: 'TEAM',
          parentId: 1,
          depth: 1,
          contactEmail: 'marketing@agenticcp.com',
          status: 'ACTIVE',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          createdBy: 'admin',
          updatedBy: 'admin',
          parentName: 'AgenticCP 본사',
          childrenCount: 0,
          membersCount: 5,
          tenantsCount: 1,
        },
      ];
      set({ organizations: dummyOrganizations, isLoading: false });
    }
  },

  // 조직 트리 조회
  fetchOrganizationTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const tree = await organizationService.getOrganizationTree();
      set({ organizationTree: tree, isLoading: false });
    } catch (error) {
      // TODO: API 서버 연결 후 실제 데이터 로드
      // 현재는 더미 데이터로 대체
      console.warn('API 서버 연결 실패, 더미 트리 데이터 사용:', error);
      const dummyTree: OrganizationHierarchyResponse[] = [
        {
          organization: {
            id: 1,
            orgName: 'AgenticCP 본사',
            description: 'AgenticCP의 본사 조직',
            orgType: 'COMPANY',
            parentId: undefined,
            depth: 0,
            contactEmail: 'contact@agenticcp.com',
            contactPhone: '02-1234-5678',
            address: '서울시 강남구 테헤란로 123',
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
            parentName: undefined,
            childrenCount: 3,
            membersCount: 15,
            tenantsCount: 5,
          },
          children: [
            {
              organization: {
                id: 2,
                orgName: '개발팀',
                description: '소프트웨어 개발을 담당하는 팀',
                orgType: 'TEAM',
                parentId: 1,
                depth: 1,
                contactEmail: 'dev@agenticcp.com',
                status: 'ACTIVE',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                createdBy: 'admin',
                updatedBy: 'admin',
                parentName: 'AgenticCP 본사',
                childrenCount: 2,
                membersCount: 8,
                tenantsCount: 2,
              },
              children: [
                {
                  organization: {
                    id: 4,
                    orgName: '프론트엔드 그룹',
                    description: 'React, Vue.js 등 프론트엔드 개발',
                    orgType: 'GROUP',
                    parentId: 2,
                    depth: 2,
                    status: 'ACTIVE',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                    createdBy: 'admin',
                    updatedBy: 'admin',
                    parentName: '개발팀',
                    childrenCount: 0,
                    membersCount: 4,
                    tenantsCount: 1,
                  },
                  children: [],
                },
                {
                  organization: {
                    id: 5,
                    orgName: '백엔드 그룹',
                    description: 'Spring Boot, Node.js 등 백엔드 개발',
                    orgType: 'GROUP',
                    parentId: 2,
                    depth: 2,
                    status: 'ACTIVE',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                    createdBy: 'admin',
                    updatedBy: 'admin',
                    parentName: '개발팀',
                    childrenCount: 0,
                    membersCount: 4,
                    tenantsCount: 1,
                  },
                  children: [],
                },
              ],
            },
            {
              organization: {
                id: 3,
                orgName: '마케팅팀',
                description: '마케팅 및 홍보를 담당하는 팀',
                orgType: 'TEAM',
                parentId: 1,
                depth: 1,
                contactEmail: 'marketing@agenticcp.com',
                status: 'ACTIVE',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                createdBy: 'admin',
                updatedBy: 'admin',
                parentName: 'AgenticCP 본사',
                childrenCount: 0,
                membersCount: 5,
                tenantsCount: 1,
              },
              children: [],
            },
          ],
        },
      ];
      set({ organizationTree: dummyTree, isLoading: false });
    }
  },

  // 특정 조직 조회
  fetchOrganizationById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const organization = await organizationService.getOrganizationById(id);
      set({ selectedOrganization: organization, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '조직 조회 실패',
        isLoading: false 
      });
    }
  },

  // 조직 선택
  selectOrganization: (organization) => {
    set({ selectedOrganization: organization });
    if (organization) {
      get().fetchMembers(organization.id);
    } else {
      set({ members: [] });
    }
  },

  // 조직 생성
  createOrganization: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await organizationService.createOrganization(data);
      // 트리와 목록 새로고침
      await Promise.all([
        get().fetchOrganizationTree(),
        get().fetchOrganizations()
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '조직 생성 실패',
        isLoading: false 
      });
    }
  },

  // 조직 수정
  updateOrganization: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrganization = await organizationService.updateOrganization(id, data);
      
      // 선택된 조직이 수정된 경우 업데이트
      const { selectedOrganization } = get();
      if (selectedOrganization?.id === id) {
        set({ selectedOrganization: updatedOrganization });
      }

      // 트리와 목록 새로고침
      await Promise.all([
        get().fetchOrganizationTree(),
        get().fetchOrganizations()
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '조직 수정 실패',
        isLoading: false 
      });
    }
  },

  // 조직 삭제
  deleteOrganization: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await organizationService.deleteOrganization(id);
      
      // 선택된 조직이 삭제된 경우 선택 해제
      const { selectedOrganization } = get();
      if (selectedOrganization?.id === id) {
        set({ selectedOrganization: null, members: [] });
      }

      // 트리와 목록 새로고침
      await Promise.all([
        get().fetchOrganizationTree(),
        get().fetchOrganizations()
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '조직 삭제 실패',
        isLoading: false 
      });
    }
  },

  // 조직 이동
  moveOrganization: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await organizationService.moveOrganization(id, data);
      
      // 트리와 목록 새로고침
      await Promise.all([
        get().fetchOrganizationTree(),
        get().fetchOrganizations()
      ]);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '조직 이동 실패',
        isLoading: false 
      });
    }
  },

  // 구성원 목록 조회
  fetchMembers: async (organizationId) => {
    set({ isLoading: true, error: null });
    try {
      const members = await organizationService.getOrganizationMembers(organizationId);
      set({ members, isLoading: false });
    } catch (error) {
      // TODO: API 서버 연결 후 실제 데이터 로드
      // 현재는 더미 데이터로 대체
      console.warn('API 서버 연결 실패, 더미 구성원 데이터 사용:', error);
      const dummyMembers: OrganizationMember[] = [
        {
          id: 1,
          type: 'USER',
          name: '김개발',
          email: 'kim.dev@agenticcp.com',
          role: '팀장',
          status: 'ACTIVE',
          joinedAt: '2024-01-01T00:00:00Z',
          data: {
            id: 1,
            username: 'kim.dev',
            email: 'kim.dev@agenticcp.com',
            name: '김개발',
            role: 'DEVELOPER',
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          id: 2,
          type: 'USER',
          name: '이프론트',
          email: 'lee.frontend@agenticcp.com',
          role: '개발자',
          status: 'ACTIVE',
          joinedAt: '2024-01-01T00:00:00Z',
          data: {
            id: 2,
            username: 'lee.frontend',
            email: 'lee.frontend@agenticcp.com',
            name: '이프론트',
            role: 'DEVELOPER',
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
        {
          id: 3,
          type: 'USER',
          name: '박백엔드',
          email: 'park.backend@agenticcp.com',
          role: '개발자',
          status: 'ACTIVE',
          joinedAt: '2024-01-01T00:00:00Z',
          data: {
            id: 3,
            username: 'park.backend',
            email: 'park.backend@agenticcp.com',
            name: '박백엔드',
            role: 'DEVELOPER',
            status: 'ACTIVE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      ];
      set({ members: dummyMembers, isLoading: false });
    }
  },

  // 구성원 추가
  addMember: async (organizationId, data) => {
    set({ isLoading: true, error: null });
    try {
      await organizationService.addUserToOrganization(organizationId, data);
      // 구성원 목록 새로고침
      await get().fetchMembers(organizationId);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '구성원 추가 실패',
        isLoading: false 
      });
    }
  },

  // 구성원 제거
  removeMember: async (organizationId, userId) => {
    set({ isLoading: true, error: null });
    try {
      await organizationService.removeUserFromOrganization(organizationId, userId);
      // 구성원 목록 새로고침
      await get().fetchMembers(organizationId);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '구성원 제거 실패',
        isLoading: false 
      });
    }
  },

  // 통계 조회
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await organizationService.getOrganizationStats();
      set({ stats, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '통계 조회 실패',
        isLoading: false 
      });
    }
  },

  // 로딩 상태 설정
  setLoading: (loading) => set({ isLoading: loading }),

  // 에러 초기화
  clearError: () => set({ error: null }),
}));
