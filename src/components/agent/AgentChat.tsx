import { Layout, Input, Button, Typography, Space, Spin } from 'antd';
import {
  SendOutlined,
  ClearOutlined,
  CloseOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  DollarOutlined,
  MonitorOutlined,
  DragOutlined,
} from '@ant-design/icons';
import Logo from '@/components/common/Logo';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAgentChatStore } from '@/store/agentChatStore';
import { agentService } from '@/services/agentService';
import { API_BASE_URL } from '@/constants';
import { message } from 'antd';
import type { ExecutionStep } from '@/store/agentChatStore';
import ChatMessageItem from './ChatMessageItem';
import './AgentChat.scss';

const { Sider } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface AgentChatProps {
  sidebarCollapsed?: boolean;
}

const AgentChat: React.FC<AgentChatProps> = ({ sidebarCollapsed = false }) => {
  const {
    isOpen,
    messages,
    isLoading,
    closeChat,
    addMessage,
    updateMessage,
    clearMessages,
    setLoading,
  } = useAgentChatStore();

  const [inputValue, setInputValue] = useState('');
  const [apiServerStatus, setApiServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // 사이드바 상태에 따른 최대 너비 계산
  const getMaxChatWidth = () => {
    const sidebarWidth = sidebarCollapsed ? 80 : 256; // 사이드바 너비
    const minContentWidth = sidebarCollapsed ? 400 : 500; // 사이드바가 닫혀있으면 더 넓게 사용 가능
    const availableWidth = window.innerWidth - sidebarWidth - minContentWidth;
    const maxWidth = sidebarCollapsed ? 700 : 550; // 사이드바가 닫혀있으면 최대 700px까지
    return Math.min(maxWidth, Math.max(320, availableWidth));
  };
  
  // 초기 너비를 420px로 설정 (더 넓고 사용하기 편함)
  const [chatWidth, setChatWidth] = useState(() => {
    const calculatedMaxWidth = getMaxChatWidth();
    return Math.min(420, calculatedMaxWidth);
  });

  // 초기 CSS 변수 설정
  useEffect(() => {
    const calculatedMaxWidth = getMaxChatWidth();
    const initialWidth = Math.min(420, calculatedMaxWidth);
    setChatWidth(initialWidth);
    document.documentElement.style.setProperty('--agent-chat-width', `${initialWidth}px`);
    document.documentElement.style.setProperty('--agent-chat-max-width', `${calculatedMaxWidth}px`);
  }, []);

  // API 서버 상태 확인 (개발 모드에서만)
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;
    
    if (!isDevelopment) {
      setApiServerStatus('online'); // 프로덕션에서는 항상 온라인으로 표시
      return;
    }

    const checkServerStatus = async () => {
      try {
        // 개발 모드에서는 프록시 사용
        const healthUrl = import.meta.env.DEV 
          ? '/'  // Vite 프록시 사용 - 루트 경로로 서버 상태 확인
          : `${API_BASE_URL}/`;  // 직접 API 호출 - 루트 경로로 서버 상태 확인
        
        const response = await fetch(healthUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        setApiServerStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiServerStatus('offline');
      }
    };

    checkServerStatus();
  }, []);

  // 사이드바 상태 변경 시 AI 채팅 너비 자동 조정
  useEffect(() => {
    const newMaxWidth = getMaxChatWidth();
    document.documentElement.style.setProperty('--agent-chat-max-width', `${newMaxWidth}px`);
    
    // 현재 채팅 너비가 새로운 최대 너비를 초과하면 자동으로 조정
    if (chatWidth > newMaxWidth) {
      const adjustedWidth = Math.min(chatWidth, newMaxWidth);
      setChatWidth(adjustedWidth);
      document.documentElement.style.setProperty('--agent-chat-width', `${adjustedWidth}px`);
    }
    
    // 강제로 CSS 변수 재적용
    setTimeout(() => {
      const currentWidth = document.documentElement.style.getPropertyValue('--agent-chat-width');
      if (currentWidth) {
        document.documentElement.style.setProperty('--agent-chat-width', currentWidth);
        document.documentElement.style.setProperty('--agent-chat-max-width', `${newMaxWidth}px`);
      }
    }, 50);
  }, [sidebarCollapsed, chatWidth]);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Quick command suggestions
  const quickCommands = [
    {
      key: 'aws-ec2',
      label: 'AWS EC2 인스턴스 목록',
      icon: <CloudOutlined />,
      command: 'AWS EC2 인스턴스 목록을 보여줘',
    },
    {
      key: 'cost-analysis',
      label: '비용 분석',
      icon: <DollarOutlined />,
      command: '이번 달 클라우드 비용을 분석해줘',
    },
    {
      key: 'monitoring',
      label: '모니터링 상태',
      icon: <MonitorOutlined />,
      command: '현재 모니터링 상태를 확인해줘',
    },
    {
      key: 'optimization',
      label: '리소스 최적화',
      icon: <ThunderboltOutlined />,
      command: '리소스 최적화 제안을 해줘',
    },
  ];

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
  };

  // 리사이즈 핸들러
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 320; // 최소 너비 증가
    const currentMaxWidth = getMaxChatWidth(); // 현재 사이드바 상태에 따른 최대 너비
    
    if (newWidth >= minWidth && newWidth <= currentMaxWidth) {
      setChatWidth(newWidth);
      
      // 리사이즈 중 CSS 변수 업데이트
      document.documentElement.style.setProperty('--agent-chat-width', `${newWidth}px`);
    }
  }, [isResizing, sidebarCollapsed]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // 리사이즈 이벤트 리스너 등록
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // CSS 변수 업데이트 (메인 레이아웃만 조정)
  useEffect(() => {
    document.documentElement.style.setProperty('--agent-chat-width', `${chatWidth}px`);
  }, [chatWidth, isOpen]);


  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 실행 단계 시뮬레이션
  const simulateExecutionSteps = async (messageId: string) => {
    const steps: ExecutionStep[] = ['thinking', 'analyzing', 'fetching', 'processing', 'executing', 'rendering', 'completed'];
    
    for (let i = 0; i < steps.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
      updateMessage(messageId, { 
        executionStep: steps[i],
        steps: steps.slice(0, i + 1),
        executionContext: {
          tool: i >= 2 ? 'AWS API' : undefined,
          endpoint: i >= 2 ? '/api/v1/cloud/ec2/instances' : undefined,
          duration: 300 + Math.random() * 400,
        }
      });
    }
  };

  // 스트리밍 응답 시뮬레이션
  const streamResponse = async (messageId: string, fullContent: string) => {
    const words = fullContent.split(' ');
    let streamedContent = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
      streamedContent += (i > 0 ? ' ' : '') + words[i];
      updateMessage(messageId, { streamedContent });
    }

    // 스트리밍 완료 후 실제 content로 업데이트
    // 모든 단계를 포함하여 마지막 단계도 완료 표시되도록 함
    const allSteps: ExecutionStep[] = ['thinking', 'analyzing', 'fetching', 'processing', 'executing', 'rendering', 'completed'];
    updateMessage(messageId, { 
      content: fullContent,
      streamedContent: undefined,
      executionStep: 'completed',
      steps: allSteps, // 모든 단계 포함
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      status: 'sent',
    });

    // Send to agent
    setLoading(true);
    
    // 차세대: Agent 메시지 미리 생성 (실행 단계 표시용)
    const agentMessageId = addMessage({
      role: 'agent',
      content: '',
      status: 'sending',
      executionStep: 'thinking',
      steps: ['thinking'],
    });

    try {
      const response = await agentService.sendMessage({
        message: userMessage,
      });

      // 실행 단계 시뮬레이션 시작 (비동기)
      simulateExecutionSteps(agentMessageId).then(() => {
        // 스트리밍 응답 시뮬레이션
        return streamResponse(agentMessageId, response.response);
      }).then(() => {
        // 최종 메시지 업데이트
        updateMessage(agentMessageId, {
          status: 'sent',
          metadata: {
            agent_used: response.agent_used,
            confidence: response.confidence,
            processing_time: response.processing_time,
            routing_info: response.routing_info,
            tools_used: ['AWS API', 'Data Processor'],
          },
        });
      });
    } catch (error) {
      message.error('Agent 응답 실패');
      addMessage({
        role: 'system',
        content: '죄송합니다. 응답 중 오류가 발생했습니다.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    clearMessages();
    message.success('대화 내역이 삭제되었습니다');
  };

  if (!isOpen) return null;

  return (
    <Sider
      width={chatWidth}
      className="agent-chat-sider"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 100,
        overflow: 'hidden',
        borderLeft: '1px solid rgba(99, 102, 241, 0.1)',
      }}
      ref={chatRef}
    >
      <div className="agent-chat-container">
        {/* AI Chat Header */}
        <div className="agent-chat-header">
          <div className="chat-header-left">
            <RobotOutlined className="chat-header-icon" />
            <Title level={5} className="chat-header-title">
              AI Agent
            </Title>
            {import.meta.env.DEV && apiServerStatus === 'online' && (
              <span className="status-indicator" />
            )}
          </div>
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={handleClear}
              title="대화 내역 삭제"
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={closeChat}
              title="닫기"
            />
          </Space>
        </div>

        {/* Messages */}
        <div className="agent-chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state-content">
                <div className="empty-state-icon-wrapper">
                  <div className="empty-state-icon-bg" />
                  <Logo 
                    variant="square" 
                    width={80} 
                    height={80}
                    className="empty-state-logo"
                    animated={true}
                    glow={true}
                  />
                  <div className="empty-state-glow" />
                </div>
                <Title level={3} className="empty-state-title">
                  AI Agent와 대화를 시작하세요
                </Title>
                <Text type="secondary" className="empty-state-subtitle">
                  자연어로 명령하면 Agent가 클라우드 리소스를 관리해드립니다
                </Text>
                
                <div className="quick-commands-grid">
                  {quickCommands.map((cmd) => (
                    <button
                      key={cmd.key}
                      className="quick-command-card"
                      onClick={() => handleQuickCommand(cmd.command)}
                      type="button"
                    >
                      <div className="quick-command-icon">
                        {cmd.icon}
                      </div>
                      <div className="quick-command-content">
                        <Text strong className="quick-command-label">
                          {cmd.label}
                        </Text>
                        <Text type="secondary" className="quick-command-hint">
                          클릭하여 실행
                        </Text>
                      </div>
                      <div className="quick-command-arrow">
                        →
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="agent-typing">
                  <Spin size="small" />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Agent가 응답 중입니다...
                  </Text>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="agent-chat-input">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
            autoSize={{ minRows: 2, maxRows: 4 }}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!inputValue.trim()}
            style={{ marginTop: 8, width: '100%' }}
          >
            전송
          </Button>
        </div>
      </div>
      
      {/* 리사이즈 핸들 */}
      <div 
        className="resize-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="drag-icon">
          <DragOutlined />
        </div>
      </div>
    </Sider>
  );
};

export default AgentChat;

