import { Card, Table, Tag, Space, Button, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { ResultType, ChatMessage } from '@/store/agentChatStore';
import './InteractiveResult.scss';

const { Text } = Typography;

interface InteractiveResultProps {
  message: ChatMessage;
  resultType?: ResultType;
  data?: any;
  onAction?: (action: string, params?: Record<string, any>) => void;
}

const InteractiveResult: React.FC<InteractiveResultProps> = ({ 
  message,
  resultType = 'text',
  data,
  onAction 
}) => {
  // 데이터가 없으면 렌더링하지 않음
  if (!data && !message.metadata?.result) {
    return null;
  }

  const resultData = data || message.metadata?.result;
  const actions = message.metadata?.interactive_actions || [];

  // 테이블 형식 결과
  if (resultType === 'table' || (Array.isArray(resultData) && resultData.length > 0 && typeof resultData[0] === 'object')) {
    const columns = Object.keys(resultData[0] || {}).map(key => ({
      title: key,
      dataIndex: key,
      key,
      render: (text: any) => {
        if (typeof text === 'boolean') {
          return text ? <Tag color="success">✓</Tag> : <Tag color="default">✗</Tag>;
        }
        if (typeof text === 'object') {
          return <Text code>{JSON.stringify(text)}</Text>;
        }
        return text;
      },
    }));

    return (
      <div className="interactive-result table-result">
        <Card 
          size="small" 
          className="result-card"
          title={
            <Space>
              <Text strong>📊 데이터 결과</Text>
              {resultData.length > 0 && (
                <Tag>{resultData.length}개 항목</Tag>
              )}
            </Space>
          }
          extra={
            actions.length > 0 && (
              <Space>
                {actions.map((action, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    icon={<PlayCircleOutlined />}
                    onClick={() => onAction?.(action.action, action.params)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Space>
            )
          }
        >
          <Table
            dataSource={resultData}
            columns={columns}
            pagination={{ pageSize: 10, size: 'small' }}
            size="small"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    );
  }

  // 리스트 형식 결과
  if (resultType === 'list' || Array.isArray(resultData)) {
    return (
      <div className="interactive-result list-result">
        <Card size="small" className="result-card">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {resultData.map((item: any, idx: number) => (
              <Card 
                key={idx}
                size="small"
                className="list-item-card"
                hoverable
                onClick={() => onAction?.('view', { item })}
              >
                {typeof item === 'string' ? (
                  <Text>{item}</Text>
                ) : (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="list-item-field">
                        <Text type="secondary" style={{ fontSize: 12 }}>{key}:</Text>
                        <Text strong style={{ marginLeft: 8 }}>{String(value)}</Text>
                      </div>
                    ))}
                  </Space>
                )}
              </Card>
            ))}
          </Space>
        </Card>
      </div>
    );
  }

  // 카드 형식 결과
  if (resultType === 'card' || (typeof resultData === 'object' && !Array.isArray(resultData))) {
    return (
      <div className="interactive-result card-result">
        <Card 
          size="small"
          className="result-card"
          title={typeof resultData.title === 'string' ? resultData.title : '결과'}
          extra={
            <Space>
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  type="primary"
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={() => onAction?.(action.action, action.params)}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {Object.entries(resultData).map(([key, value]) => {
              if (key === 'title') return null;
              return (
                <div key={key} className="card-field">
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                    {key}
                  </Text>
                  <Text strong>{String(value)}</Text>
                </div>
              );
            })}
          </Space>
        </Card>
      </div>
    );
  }

  // 액션 가능한 결과
  if (resultType === 'action' || actions.length > 0) {
    return (
      <div className="interactive-result action-result">
        <Card size="small" className="result-card">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {resultData && (
              <div className="action-content">
                {typeof resultData === 'string' ? (
                  <Text>{resultData}</Text>
                ) : (
                  <Text>{JSON.stringify(resultData, null, 2)}</Text>
                )}
              </div>
            )}
            <Space wrap>
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => onAction?.(action.action, action.params)}
                >
                  {action.label}
                </Button>
              ))}
            </Space>
          </Space>
        </Card>
      </div>
    );
  }

  return null;
};

export default InteractiveResult;
