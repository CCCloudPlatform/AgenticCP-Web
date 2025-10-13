import { Avatar, Typography, Tag, Card, Space } from 'antd';
import { UserOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ChatMessage } from '@/store/agentChatStore';
import { formatDate } from '@/utils/format';
import './ChatMessageItem.scss';

const { Text, Paragraph } = Typography;

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.role === 'user';
  const isAgent = message.role === 'agent';
  const isSystem = message.role === 'system';

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
        </div>
        <div className="message-body">
          <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Paragraph>
          
          {/* Show action metadata for agent messages */}
          {isAgent && message.metadata?.action && (
            <Card size="small" style={{ marginTop: 8, background: '#f0f9ff' }}>
              <Space direction="vertical" size="small">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  수행된 작업: <Tag color="blue">{message.metadata.action}</Tag>
                </Text>
                {message.metadata.result && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    결과: {JSON.stringify(message.metadata.result)}
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

