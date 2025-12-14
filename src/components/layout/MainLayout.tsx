import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import AgentChat from '@/components/agent/AgentChat';
import { useAgentChatStore } from '@/store/agentChatStore';
import './MainLayout.scss';

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: isAgentChatOpen } = useAgentChatStore();

  // AI 채팅 상태에 따라 body 클래스 추가
  useEffect(() => {
    if (isAgentChatOpen) {
      document.body.classList.add('agent-chat-open');
    } else {
      document.body.classList.remove('agent-chat-open');
    }
    
    return () => {
      document.body.classList.remove('agent-chat-open');
    };
  }, [isAgentChatOpen]);

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
      <AgentChat sidebarCollapsed={collapsed} />
    </div>
  );
};

export default MainLayout;

