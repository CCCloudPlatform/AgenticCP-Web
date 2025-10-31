import { Layout, Input, Button, Typography, Space, Empty, Spin, Dropdown } from 'antd';
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
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAgentChatStore } from '@/store/agentChatStore';
import { agentService } from '@/services/agentService';
import { API_BASE_URL } from '@/constants';
import { message } from 'antd';
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
    const maxWidth = sidebarCollapsed ? 600 : 400; // 사이드바가 닫혀있으면 최대 600px까지
    return Math.min(maxWidth, Math.max(250, availableWidth));
  };
  
  const maxChatWidth = getMaxChatWidth();
  const [chatWidth, setChatWidth] = useState(Math.min(350, maxChatWidth)); // 초기 너비를 350px로 제한

  // 초기 CSS 변수 설정
  useEffect(() => {
    const initialWidth = Math.min(350, maxChatWidth);
    document.documentElement.style.setProperty('--agent-chat-width', `${initialWidth}px`);
    document.documentElement.style.setProperty('--agent-chat-max-width', `${maxChatWidth}px`);
  }, [maxChatWidth]);

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
    const minWidth = 300;
    const currentMaxWidth = getMaxChatWidth(); // 현재 사이드바 상태에 따른 최대 너비
    
    if (newWidth >= minWidth && newWidth <= currentMaxWidth) {
      setChatWidth(newWidth);
      
      // 리사이즈 중 CSS 변수 업데이트
      document.documentElement.style.setProperty('--agent-chat-width', `${newWidth}px`);
    }
  }, [isResizing, sidebarCollapsed]); // sidebarCollapsed 의존성으로 변경

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
    try {
      const response = await agentService.sendMessage({
        message: userMessage,
      });

      // Add agent response
      addMessage({
        role: 'agent',
        content: response.response,
        status: 'sent',
        metadata: {
          agent_used: response.agent_used,
          confidence: response.confidence,
          processing_time: response.processing_time,
          routing_info: response.routing_info,
        },
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
        zIndex: 100, // 헤더보다 낮게 설정
        background: '#fff',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        borderLeft: '1px solid #e8e8e8',
      }}
      ref={chatRef}
    >
      <div className="agent-chat-container">
        {/* AI Chat Header */}
        <div className="agent-chat-header">
          <div className="chat-header-left">
            <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                AI Agent
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                자연어로 명령을 수행하세요
                {import.meta.env.DEV && (
                  <>
                    {apiServerStatus === 'online' && (
                      <span style={{ color: '#52c41a', marginLeft: 8 }}>🟢 온라인</span>
                    )}
                    {apiServerStatus === 'offline' && (
                      <span style={{ color: '#ff4d4f', marginLeft: 8 }}>🔴 오프라인 (Mock)</span>
                    )}
                    {apiServerStatus === 'checking' && (
                      <span style={{ color: '#faad14', marginLeft: 8 }}>🟡 확인 중</span>
                    )}
                  </>
                )}
              </Text>
            </div>
          </div>
          <Space>
            <Dropdown
              menu={{
                items: quickCommands.map(cmd => ({
                  key: cmd.key,
                  label: (
                    <Space>
                      {cmd.icon}
                      {cmd.label}
                    </Space>
                  ),
                  onClick: () => handleQuickCommand(cmd.command),
                })),
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<ThunderboltOutlined />}
                title="빠른 명령어"
              />
            </Dropdown>
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={handleClear}
              title="대화 내역 삭제"
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={closeChat}
              title="닫기"
            />
          </Space>
        </div>

        {/* Messages */}
        <div className="agent-chat-messages">
          {messages.length === 0 ? (
            <Empty
              image={<RobotOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
              description={
                <div>
                  <Text>AI Agent와 대화를 시작하세요</Text>
                  <div style={{ marginTop: 16 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      예시: "AWS EC2 인스턴스 목록을 보여줘"
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      "비용이 가장 많이 나오는 리소스를 찾아줘"
                    </Text>
                  </div>
                </div>
              }
            />
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

