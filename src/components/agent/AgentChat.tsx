import { Layout, Input, Button, Typography, Space, Empty, Spin } from 'antd';
import {
  SendOutlined,
  ClearOutlined,
  CloseOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { useAgentChatStore } from '@/store/agentChatStore';
import { agentService } from '@/services/agentService';
import { message } from 'antd';
import ChatMessageItem from './ChatMessageItem';
import './AgentChat.scss';

const { Sider } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;

const AgentChat = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        content: response.message,
        status: 'sent',
        metadata: {
          action: response.action,
          result: response.result,
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
      width={400}
      className="agent-chat-sider"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 100,
        background: '#fff',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <div className="agent-chat-container">
        {/* Header */}
        <div className="agent-chat-header">
          <Space>
            <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                AI Agent
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                자연어로 명령을 수행하세요
              </Text>
            </div>
          </Space>
          <Space>
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
    </Sider>
  );
};

export default AgentChat;

