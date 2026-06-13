'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chat.store';
import { NewChatButton } from './NewChatButton';
import { Chat } from '@/types/chat';

export function ChatSidebar() {
  const { chats, activeChat, setActiveChat, deleteChat } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChat, setExpandedChat] = useState<string | null>(null);

  const filteredChats = useMemo(() => {
    return chats.filter((chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [chats, searchTerm]);

  const pinnedChats = filteredChats.filter((c) => c.isPinned);
  const regularChats = filteredChats.filter((c) => !c.isPinned);

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chatId);
    }
  };

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-screen"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white mb-4">MAGS Chat</h1>
        <NewChatButton />
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-slate-700">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedChats.length > 0 && (
          <div className="px-3 py-4">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 px-2 uppercase">
              Pinned
            </h3>
            <AnimatePresence>
              {pinnedChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onSelect={() => setActiveChat(chat)}
                  onDelete={(e) => handleDeleteChat(e, chat.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Regular Chats */}
        {regularChats.length > 0 && (
          <div className="px-3 py-4">
            {pinnedChats.length > 0 && (
              <h3 className="text-xs font-semibold text-gray-400 mb-2 px-2 uppercase">
                Recent
              </h3>
            )}
            <AnimatePresence>
              {regularChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onSelect={() => setActiveChat(chat)}
                  onDelete={(e) => handleDeleteChat(e, chat.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredChats.length === 0 && (
          <div className="p-4 text-center text-gray-400">
            <p className="text-sm">
              {chats.length === 0
                ? 'No chats yet. Create one to get started!'
                : 'No matching chats found'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Individual chat item component
 */
function ChatItem({
  chat,
  isActive,
  onSelect,
  onDelete,
}: {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={onSelect}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition group ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{chat.title}</p>
          {chat.messageCount > 0 && (
            <p className="text-xs text-gray-400">{chat.messageCount} messages</p>
          )}
        </div>
        {hovering && (
          <button
            onClick={onDelete}
            className="text-red-400 hover:text-red-300 transition"
          >
            ✕
          </button>
        )}
      </div>
    </motion.button>
  );
}
