import { Avatar, Typography, Tag, Card, Space, Button, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, InfoCircleOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ChatMessage } from '@/store/agentChatStore';
import { formatDate } from '@/utils/format';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
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


  return (
    <div className={`chat-message-item ${message.role}`}>
      <div className="message-avatar">{getAvatar()}</div>
      <div className="message-content">
        <div className="message-header">
          <Text strong>{getRoleName()}</Text>
          <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
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
        <div className="message-body">
          {isAgent ? (
            <div className="markdown-content">
              {formatEC2Content(message.content)}
            </div>
          ) : (
            <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Paragraph>
          )}
          
          {/* AI 응답에 따른 액션 버튼들 */}
          {isAgent && getActionButtons() && (
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
          
          {/* Show agent metadata for agent messages */}
          {isAgent && message.metadata?.agent_used && (
            <Card size="small" style={{ marginTop: 8, background: '#f0f9ff' }}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  사용된 Agent: <Tag color="blue">{message.metadata.agent_used}</Tag>
                </Text>
                {message.metadata.confidence && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    신뢰도: {(message.metadata.confidence * 100).toFixed(1)}%
                  </Text>
                )}
                {message.metadata.processing_time && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    처리 시간: {message.metadata.processing_time}초
                  </Text>
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

