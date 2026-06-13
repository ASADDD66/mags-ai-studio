'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { chatApi } from '@/lib/chat-api';
import { Chat } from '@/types/chat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function ChatArea({ chat }: { chat: Chat }) {
  const { messages, setMessages, isLoading } = useMessageStore();

  useEffect(() => {
    // Load chat history when chat changes
    loadChatHistory();
  }, [chat.id]);

  const loadChatHistory = async () => {
    try {
      const response = await chatApi.getChatHistory(chat.id);
      setMessages(response.messages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  return (
    <motion.div
      key={chat.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col h-full bg-slate-800"
    >
      {/* Header */}
      <ChatHeader chat={chat} />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <MessageList messages={messages} chatId={chat.id} />
        )}
      </div>

      {/* Input */}
      <MessageInput chatId={chat.id} />
    </motion.div>
  );
}
