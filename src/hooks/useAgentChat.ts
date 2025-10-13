import { useAgentChatStore } from '@/store/agentChatStore';
import { agentService } from '@/services/agentService';
import { message } from 'antd';

/**
 * Agent Chat Hook
 */
export const useAgentChat = () => {
  const { addMessage, setLoading, isLoading } = useAgentChatStore();

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

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

      return response;
    } catch (error) {
      message.error('Agent 응답 실패');
      addMessage({
        role: 'system',
        content: '죄송합니다. 응답 중 오류가 발생했습니다.',
        status: 'error',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async (command: string, params?: Record<string, unknown>) => {
    const commandMessage = params
      ? `${command} ${JSON.stringify(params)}`
      : command;
    
    return sendMessage(commandMessage);
  };

  return {
    sendMessage,
    sendCommand,
  };
};

