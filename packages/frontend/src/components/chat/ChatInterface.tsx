'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chat.store';
import { useMessageStore } from '@/stores/message.store';
import { wsClient } from '@/lib/websocket';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function ChatInterface() {
  const { activeChat, fetchChats, isLoading } = useChatStore();
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Fetch chats on mount
    fetchChats();

    // Connect WebSocket
    wsClient
      .connect()
      .then(() => {
        setWsConnected(true);
      })
      .catch((error) => {
        console.error('WebSocket connection failed:', error);
      });

    return () => {
      wsClient.disconnect();
    };
  }, [fetchChats]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col bg-slate-800"
      >
        {activeChat && wsConnected ? (
          <ChatArea chat={activeChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="text-gray-400">
                {!wsConnected ? 'Connecting...' : 'Select or create a chat to start'}
              </p>
              {!wsConnected && <LoadingSpinner />}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
