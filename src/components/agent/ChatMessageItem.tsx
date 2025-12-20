import { Avatar, Typography, Tag, Card, Space, Button, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, InfoCircleOutlined, CopyOutlined, CheckOutlined, ToolOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage } from '@/store/agentChatStore';
import { formatDate } from '@/utils/format';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import ExecutionStatus from './ExecutionStatus';
import InteractiveResult from './InteractiveResult';
import './ChatMessageItem.scss';

const { Text, Paragraph } = Typography;

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';

  const getAvatar = () => {
    if (isUser) {
      return <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />;
    }
    if (isAgent) {
      return <Avatar icon={<RobotOutlined />} style={{ background: '#52c41a' }} />;
    }
    return <Avatar icon={<InfoCircleOutlined />} style={{ background: '#faad14' }} />;
  };

  const getRoleName = () => {
    if (isUser) return '나';
    if (isAgent) return 'AI Agent';
    return '시스템';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // AI 응답에 따른 액션 버튼들
  const getActionButtons = () => {
    if (!isAgent) return null;

    const actions = [];
    
    // 대시보드 관련 액션
    if (message.content.includes('대시보드') || message.content.includes('리소스 현황')) {
      actions.push({
        label: '📊 대시보드 보기',
        action: 'navigate',
        path: '/dashboard',
        color: '#1890ff'
      });
    }
    
    // 클라우드 리소스 관련 액션
    if (message.content.includes('클라우드') || message.content.includes('AWS') || message.content.includes('리소스')) {
      actions.push({
        label: '☁️ 리소스 관리',
        action: 'navigate',
        path: '/cloud/resources',
        color: '#52c41a'
      });
    }
    
    // 비용 관리 관련 액션
    if (message.content.includes('비용') || message.content.includes('cost')) {
      actions.push({
        label: '💰 비용 분석',
        action: 'navigate',
        path: '/cost',
        color: '#faad14'
      });
    }
    
    // 모니터링 관련 액션
    if (message.content.includes('모니터링') || message.content.includes('알림')) {
      actions.push({
        label: '📊 모니터링 설정',
        action: 'navigate',
        path: '/monitoring',
        color: '#722ed1'
      });
    }
    
    // 보안 관련 액션
    if (message.content.includes('보안') || message.content.includes('security')) {
      actions.push({
        label: '🔒 보안 관리',
        action: 'navigate',
        path: '/security',
        color: '#f5222d'
      });
    }

    return actions;
  };


  const handleActionClick = (action: any) => {
    if (action.action === 'navigate') {
      console.log(`Navigate to: ${action.path}`);
      navigate(action.path);
    }
  };

  const formatEC2Content = (content: string) => {
    // EC2 인스턴스 목록이 포함된 경우 특별 처리
    if (content.includes('EC2 인스턴스 목록')) {
      const lines = content.split('\n');
      const titleLine = lines[0];
      const instanceLines = lines.slice(1).filter(line => line.trim());
      
      return (
        <div>
          <div className="ec2-title">{titleLine}</div>
          <div className="ec2-instances">
            {instanceLines.map((line, index) => {
              if (line.includes('•')) {
                const cleanLine = line.replace('•', '').trim();
                const parts = cleanLine.split(' - ');
                if (parts.length >= 2) {
                  const instanceInfo = parts[0];
                  const statusInfo = parts[1];
                  
                  // Public IP 추출
                  const publicIpMatch = statusInfo.match(/Public IP: ([\d.]+)/);
                  const status = statusInfo.replace(/ - Public IP: [\d.]+/, '');
                  
                  return (
                    <div key={index} className="instance-item">
                      <div className="instance-info">
                        <span className="instance-id">{instanceInfo}</span>
                        <span className={`status ${status.toLowerCase().replace(' ', '-')}`}>
                          {status}
                        </span>
                      </div>
                      {publicIpMatch && (
                        <div className="public-ip">
                          Public IP: <span className="ip-address">{publicIpMatch[1]}</span>
                        </div>
                      )}
                    </div>
                  );
                }
              }
              return <div key={index} className="instance-line">{line}</div>;
            })}
          </div>
        </div>
      );
    }
    
    // 일반 마크다운 처리
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = node?.tagName === 'code' && !match;
            if (!isInline && match) {
              return (
                <pre className="code-block">
                  <code className={`language-${match[1]}`} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };


  // 실행 단계 표시 여부 (Agent 메시지이고 아직 완료되지 않았거나 실행 컨텍스트가 있는 경우)
  const showExecutionStatus = isAgent && (
    message.executionStep || 
    message.executionContext || 
    (message.status === 'sending' && !message.executionStep)
  );

  // 인터랙티브 결과 표시 여부
  const showInteractiveResult = isAgent && (
    message.resultType ||
    message.metadata?.result ||
    (message.metadata?.interactive_actions?.length ?? 0) > 0
  );

  const handleAction = (action: string, params?: Record<string, any>) => {
    if (action === 'navigate' && params?.path) {
      navigate(params.path);
    } else {
      console.log('Action:', action, params);
    }
  };

  return (
    <div className={`chat-message-item ${message.role} next-gen`}>
      <div className="message-avatar">{getAvatar()}</div>
      <div className="message-content">
        <div className="message-header">
          <Space>
            <Text strong>{getRoleName()}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatDate(message.timestamp, 'HH:mm')}
            </Text>
            {message.status === 'sending' && (
              <Tag color="processing" style={{ marginLeft: 8 }}>
                전송 중
              </Tag>
            )}
            {message.status === 'error' && (
              <Tag color="error" style={{ marginLeft: 8 }}>
                오류
              </Tag>
            )}
            {message.metadata?.tools_used && message.metadata.tools_used.length > 0 && (
              <Tag 
                icon={<ToolOutlined />} 
                color="purple" 
                style={{ marginLeft: 8 }}
              >
                {message.metadata.tools_used.length}개 도구 사용
              </Tag>
            )}
          </Space>
          {!isUser && (
            <Space>
              <Tooltip title={copied ? '복사됨!' : '복사하기'}>
                <Button
                  type="text"
                  size="small"
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={handleCopy}
                  style={{ opacity: 0.6 }}
                />
              </Tooltip>
            </Space>
          )}
        </div>

        {/* 차세대: 실행 상태 표시 */}
        {showExecutionStatus && (
          <ExecutionStatus
            currentStep={message.executionStep || 'thinking'}
            steps={message.steps}
            context={message.executionContext}
          />
        )}

        <div className="message-body">
          {/* 스트리밍 중인 내용 표시 */}
          {isAgent && message.streamedContent && (
            <div className="streaming-content">
              <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                {message.streamedContent}
                <span className="cursor-blink">▋</span>
              </Paragraph>
            </div>
          )}

          {/* 일반 메시지 내용 */}
          {!message.streamedContent && (
            <>
              {isAgent ? (
                <div className="markdown-content">
                  {formatEC2Content(message.content)}
                </div>
              ) : (
                <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Paragraph>
              )}
            </>
          )}
          
          {/* 차세대: 인터랙티브 결과 표시 */}
          {showInteractiveResult && (
            <InteractiveResult
              message={message}
              resultType={message.resultType}
              data={message.metadata?.result}
              onAction={handleAction}
            />
          )}
          
          {/* 기존 액션 버튼들 (차세대 인터페이스와 병행) */}
          {isAgent && getActionButtons() && !showInteractiveResult && (
            <div className="action-buttons" style={{ marginTop: 12 }}>
              <Space wrap>
                {getActionButtons()?.map((action, index) => (
                  <Button
                    key={index}
                    size="small"
                    style={{ 
                      backgroundColor: action.color,
                      borderColor: action.color,
                      color: 'white'
                    }}
                    onClick={() => handleActionClick(action)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Space>
            </div>
          )}
          
          {/* 실행 컨텍스트 및 메타데이터 */}
          {isAgent && (message.metadata?.agent_used || message.metadata?.tools_used?.length) && (
            <Card size="small" className="execution-metadata" style={{ marginTop: 8 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {message.metadata.agent_used && (
                  <div className="metadata-item">
                    <Text type="secondary" style={{ fontSize: 11 }}>Agent:</Text>
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {message.metadata.agent_used}
                    </Tag>
                  </div>
                )}
                {message.metadata.tools_used && message.metadata.tools_used.length > 0 && (
                  <div className="metadata-item">
                    <Text type="secondary" style={{ fontSize: 11 }}>도구:</Text>
                    <Space wrap style={{ marginLeft: 8 }}>
                      {message.metadata.tools_used.map((tool, idx) => (
                        <Tag key={idx} color="purple" style={{ fontSize: 10 }}>
                          {tool}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}
                {message.metadata.confidence && (
                  <div className="metadata-item">
                    <Text type="secondary" style={{ fontSize: 11 }}>신뢰도:</Text>
                    <Text strong style={{ marginLeft: 8 }}>
                      {(message.metadata.confidence * 100).toFixed(1)}%
                    </Text>
                  </div>
                )}
                {message.executionContext?.duration && (
                  <div className="metadata-item">
                    <Text type="secondary" style={{ fontSize: 11 }}>실행 시간:</Text>
                    <Text strong style={{ marginLeft: 8 }}>
                      {message.executionContext.duration}ms
                    </Text>
                  </div>
                )}
              </Space>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;

