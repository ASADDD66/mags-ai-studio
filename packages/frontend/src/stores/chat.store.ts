import { create } from 'zustand';
import { chatApi } from '@/lib/chat-api';
import { Chat, CreateChatPayload } from '@/types/chat';

interface ChatStore {
  // State
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchChats: () => Promise<void>;
  fetchChat: (chatId: string) => Promise<void>;
  createChat: (payload: CreateChatPayload) => Promise<Chat>;
  setActiveChat: (chat: Chat | null) => void;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  togglePinChat: (chatId: string) => Promise<void>;
  clearChatHistory: (chatId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  isLoading: false,
  error: null,

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const chats = await chatApi.getUserChats();
      set({ chats });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch chats';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChat: async (chatId: string) => {
    set({ isLoading: true, error: null });
    try {
      const chat = await chatApi.getChatById(chatId);
      set({ activeChat: chat });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch chat';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createChat: async (payload: CreateChatPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newChat = await chatApi.createChat(payload);
      set((state) => ({
        chats: [newChat, ...state.chats],
        activeChat: newChat,
      }));
      return newChat;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create chat';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveChat: (chat) => {
    set({ activeChat: chat });
  },

  updateChatTitle: async (chatId: string, title: string) => {
    try {
      await chatApi.updateChatTitle(chatId, title);
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, title } : c,
        ),
        activeChat:
          state.activeChat?.id === chatId
            ? { ...state.activeChat, title }
            : state.activeChat,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update chat title';
      set({ error: message });
      throw error;
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      set((state) => ({
        chats: state.chats.filter((c) => c.id !== chatId),
        activeChat: state.activeChat?.id === chatId ? null : state.activeChat,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete chat';
      set({ error: message });
      throw error;
    }
  },

  togglePinChat: async (chatId: string) => {
    try {
      const result = await chatApi.togglePinChat(chatId);
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, isPinned: result.isPinned } : c,
        ),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to toggle pin';
      set({ error: message });
      throw error;
    }
  },

  clearChatHistory: async (chatId: string) => {
    try {
      await chatApi.clearChatHistory(chatId);
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId
            ? { ...c, messageCount: 0, tokenUsage: 0, lastMessageAt: undefined }
            : c,
        ),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear history';
      set({ error: message });
      throw error;
    }
  },

  setError: (error) => {
    set({ error });
  },
}));
