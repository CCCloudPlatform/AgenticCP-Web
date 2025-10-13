import { apiRequest } from './api';

export interface AgentRequest {
  message: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

export interface AgentResponse {
  message: string;
  sessionId: string;
  action?: string;
  result?: unknown;
  suggestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// 🔧 개발용 Mock 응답
const MOCK_RESPONSES = [
  "현재 실행 중인 AWS EC2 인스턴스는 5개입니다.",
  "이번 달 AWS 총 비용은 $1,234입니다.",
  "가장 많은 비용이 발생한 리소스는 EC2 (t3.large) 인스턴스입니다.",
  "최근 1시간 동안 3개의 알림이 발생했습니다.",
  "요청하신 작업을 수행했습니다.",
];

const getMockResponse = (message: string): AgentResponse => {
  const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  
  return {
    message: `✅ ${randomResponse}\n\n(🔧 개발 모드: Mock 응답)`,
    sessionId: 'mock-session-' + Date.now(),
    action: 'query_resources',
    result: { count: 5, status: 'success' },
    suggestions: ['다음 명령을 시도해보세요', '비용 분석', '알림 확인'],
  };
};

/**
 * Agent Service
 */
export const agentService = {
  /**
   * Send message to agent
   */
  sendMessage: (request: AgentRequest): Promise<AgentResponse> => {
    // 🔧 개발 모드: Mock 응답 반환
    const token = localStorage.getItem('agenticcp_token');
    if (token && token.startsWith('mock-jwt-token')) {
      console.log('🔓 개발용 Mock Agent 응답');
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockResponse(request.message));
        }, 1000); // 1초 딜레이로 실제 API처럼 보이게
      });
    }

    return apiRequest.post<AgentResponse>('/api/v1/agent/chat', request);
  },

  /**
   * Get chat sessions
   */
  getSessions: (): Promise<ChatSession[]> => {
    return apiRequest.get<ChatSession[]>('/api/v1/agent/sessions');
  },

  /**
   * Get session by ID
   */
  getSession: (sessionId: string): Promise<ChatSession> => {
    return apiRequest.get<ChatSession>(`/api/v1/agent/sessions/${sessionId}`);
  },

  /**
   * Delete session
   */
  deleteSession: (sessionId: string): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/agent/sessions/${sessionId}`);
  },

  /**
   * Get suggested commands
   */
  getSuggestions: (): Promise<string[]> => {
    return apiRequest.get<string[]>('/api/v1/agent/suggestions');
  },
};

