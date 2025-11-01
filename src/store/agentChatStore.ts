import { create } from 'zustand';

/**
 * 실행 단계 타입
 */
export type ExecutionStep = 
  | 'thinking'      // 생각 중
  | 'analyzing'      // 분석 중
  | 'fetching'        // 데이터 수집 중
  | 'processing'     // 처리 중
  | 'executing'      // 실행 중
  | 'rendering'      // 결과 생성 중
  | 'completed'      // 완료
  | 'error';         // 오류

/**
 * 결과 타입
 */
export type ResultType = 
  | 'text'           // 일반 텍스트
  | 'table'          // 테이블
  | 'chart'          // 차트
  | 'list'           // 리스트
  | 'card'           // 카드
  | 'code'           // 코드
  | 'action'         // 액션 가능
  | 'mixed';         // 혼합

/**
 * 실행 컨텍스트
 */
export interface ExecutionContext {
  tool?: string;                    // 사용된 도구/API
  endpoint?: string;                 // API 엔드포인트
  parameters?: Record<string, any>;  // 실행 파라미터
  duration?: number;                  // 실행 시간 (ms)
  tokens?: number;                   // 사용된 토큰
}

/**
 * 차세대 AI Agent 메시지 인터페이스
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  
  // 차세대 확장 필드
  executionStep?: ExecutionStep;     // 현재 실행 단계
  resultType?: ResultType;           // 결과 타입
  executionContext?: ExecutionContext; // 실행 컨텍스트
  steps?: ExecutionStep[];            // 전체 실행 단계 히스토리
  streamedContent?: string;          // 스트리밍된 내용 (진행 중)
  
  metadata?: {
    action?: string;
    result?: unknown;
    error?: string;
    agent_used?: string;
    confidence?: number;
    processing_time?: number;
    routing_info?: {
      intent: string;
      confidence: number;
      processing_time: number;
    };
    // 차세대 메타데이터
    tools_used?: string[];            // 사용된 도구 목록
    data_sources?: string[];         // 데이터 소스
    interactive_actions?: {           // 인터랙티브 액션
      label: string;
      action: string;
      params?: Record<string, any>;
    }[];
  };
}

interface AgentChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  activeSessionId: string | null;
  
  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: string }) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setActiveSession: (sessionId: string | null) => void;
}

export const useAgentChatStore = create<AgentChatState>((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  activeSessionId: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  openChat: () => set({ isOpen: true }),
  
  closeChat: () => set({ isOpen: false }),

  addMessage: (message) => {
    const messageId = message.id || `msg-${Date.now()}-${Math.random()}`;
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: messageId,
          timestamp: new Date(),
        },
      ],
    }));
    return messageId;
  },

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (loading) => set({ isLoading: loading }),

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),
}));

