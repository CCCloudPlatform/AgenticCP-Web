import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AgentChat from '@/components/agent/AgentChat';
import { useAgentChatStore } from '@/store/agentChatStore';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: isAgentChatOpen } = useAgentChatStore();

  return (
    <div className="main-layout">
      <Sidebar collapsed={collapsed} />
      <div 
        className={`site-layout ${collapsed ? 'sidebar-collapsed' : ''} ${isAgentChatOpen ? 'agent-chat-open' : ''}`}
      >
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <main className="site-content">
          <Outlet />
        </main>
      </div>
      <AgentChat />
    </div>
  );
};

export default MainLayout;

