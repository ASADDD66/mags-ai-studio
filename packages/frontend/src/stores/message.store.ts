import { create } from 'zustand';
import { ChatMessage, StreamingMessage } from '@/types/message';

interface MessageStore {
  // State
  messages: (ChatMessage | StreamingMessage)[];
  isLoading: boolean;
  error: string | null;
  isStreaming: boolean;
  currentStreamingMessageId: string | null;

  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage | StreamingMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  removeMessage: (id: string) => void;
  startStreaming: (tempId: string) => void;
  addStreamToken: (tempId: string, token: string) => void;
  completeStreaming: (tempId: string, message: ChatMessage) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  isStreaming: false,
  currentStreamingMessageId: null,

  setMessages: (messages) => {
    set({ messages });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id || m.tempId === id ? { ...m, ...updates } : m,
      ),
    }));
  },

  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id && m.tempId !== id),
    }));
  },

  startStreaming: (tempId) => {
    set({
      isStreaming: true,
      currentStreamingMessageId: tempId,
    });
  },

  addStreamToken: (tempId, token) => {
    set((state) => ({
      messages: state.messages.map((m) => {
        if (m.tempId === tempId) {
          return {
            ...m,
            content: m.content + token,
          };
        }
        return m;
      }),
    }));
  },

  completeStreaming: (tempId, message) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.tempId === tempId ? message : m,
      ),
      isStreaming: false,
      currentStreamingMessageId: null,
    }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setError: (error) => {
    set({ error });
  },
}));
