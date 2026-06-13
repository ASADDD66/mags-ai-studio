import { useCallback, useEffect } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { chatApi } from '@/lib/chat-api';
import { Chat } from '@/types/chat';

export function useChat(chatId?: string) {
  const { activeChat, fetchChat, createChat } = useChatStore();
  const { messages, setMessages } = useMessageStore();

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId);
      loadChatHistory(chatId);
    }
  }, [chatId, fetchChat]);

  const loadChatHistory = useCallback(async (chatId: string) => {
    try {
      const response = await chatApi.getChatHistory(chatId);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, [setMessages]);

  const startNewChat = useCallback(async () => {
    const newChat = await createChat({
      title: `Chat - ${new Date().toLocaleDateString()}`,
    });
    return newChat;
  }, [createChat]);

  return {
    chat: activeChat,
    messages,
    startNewChat,
    loadChatHistory,
  };
}