import { Modal, List, Input, Tag, Typography } from 'antd';
import { useState } from 'react';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

interface Command {
  id: string;
  title: string;
  description: string;
  category: string;
  example: string;
}

interface AgentCommandPaletteProps {
  visible: boolean;
  onClose: () => void;
  onSelectCommand: (command: string) => void;
}

const SAMPLE_COMMANDS: Command[] = [
  {
    id: '1',
    title: '리소스 목록 조회',
    description: 'AWS, GCP, Azure의 리소스 목록을 조회합니다',
    category: 'Cloud Management',
    example: 'AWS EC2 인스턴스 목록을 보여줘',
  },
  {
    id: '2',
    title: '비용 분석',
    description: '클라우드 비용을 분석하고 최적화 제안을 받습니다',
    category: 'Cost Management',
    example: '이번 달 AWS 비용 분석해줘',
  },
  {
    id: '3',
    title: '리소스 배포',
    description: '새로운 리소스를 배포합니다',
    category: 'Orchestration',
    example: 'us-east-1에 t3.micro EC2 인스턴스 배포해줘',
  },
  {
    id: '4',
    title: '알림 확인',
    description: '최근 알림 및 경고를 확인합니다',
    category: 'Monitoring',
    example: '최근 1시간 동안의 알림 보여줘',
  },
  {
    id: '5',
    title: '사용자 관리',
    description: '사용자 및 권한을 관리합니다',
    category: 'Security',
    example: '활성 사용자 목록 보여줘',
  },
];

const AgentCommandPalette = ({ visible, onClose, onSelectCommand }: AgentCommandPaletteProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredCommands, setFilteredCommands] = useState(SAMPLE_COMMANDS);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const filtered = SAMPLE_COMMANDS.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(value.toLowerCase()) ||
        cmd.description.toLowerCase().includes(value.toLowerCase()) ||
        cmd.example.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCommands(filtered);
  };

  const handleSelectCommand = (command: Command) => {
    onSelectCommand(command.example);
    onClose();
    setSearchValue('');
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span>명령 팔레트</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Search
        placeholder="명령어를 검색하세요..."
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
        size="large"
      />
      <List
        dataSource={filteredCommands}
        renderItem={(command) => (
          <List.Item
            key={command.id}
            onClick={() => handleSelectCommand(command)}
            style={{ cursor: 'pointer', padding: '12px 0' }}
            className="command-item"
          >
            <List.Item.Meta
              avatar={<ThunderboltOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
              title={
                <div>
                  {command.title}
                  <Tag color="blue" style={{ marginLeft: 8 }}>
                    {command.category}
                  </Tag>
                </div>
              }
              description={
                <div>
                  <Text type="secondary">{command.description}</Text>
                  <div style={{ marginTop: 8 }}>
                    <Text code>{command.example}</Text>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AgentCommandPalette;

