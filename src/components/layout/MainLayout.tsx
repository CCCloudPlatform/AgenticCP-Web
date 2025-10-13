import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AgentChat from '@/components/agent/AgentChat';
import { useAgentChatStore } from '@/store/agentChatStore';
import './MainLayout.scss';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: isAgentChatOpen } = useAgentChatStore();

  return (
    <Layout className="main-layout">
      <Sidebar collapsed={collapsed} />
      <Layout 
        className={`site-layout ${isAgentChatOpen ? 'agent-chat-open' : ''}`}
        style={{ 
          marginLeft: collapsed ? 80 : 250,
          marginRight: isAgentChatOpen ? 400 : 0,
        }}
      >
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
      <AgentChat />
    </Layout>
  );
};

export default MainLayout;

