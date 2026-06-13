import { apiClient } from './api-client';
import { Chat, CreateChatPayload } from '@/types/chat';
import { ChatMessage } from '@/types/message';

export const chatApi = {
  /**
   * Create new chat
   */
  createChat: async (payload: CreateChatPayload): Promise<Chat> => {
    const response = await apiClient.post<Chat>('/chat/session', payload);
    return response.data;
  },

  /**
   * Get chat by ID
   */
  getChatById: async (chatId: string): Promise<Chat> => {
    const response = await apiClient.get<Chat>(`/chat/session/${chatId}`);
    return response.data;
  },

  /**
   * Get all user chats (for sidebar)
   */
  getUserChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get<Chat[]>('/chat/sessions');
    return response.data;
  },

  /**
   * Get chat history (paginated)
   */
  getChatHistory: async (
    sessionId: string,
    skip: number = 0,
    take: number = 50,
  ): Promise<{ messages: ChatMessage[]; total: number }> => {
    const response = await apiClient.get(
      `/chat/history/${sessionId}?skip=${skip}&take=${take}`,
    );
    return response.data;
  },

  /**
   * Delete chat
   */
  deleteChat: async (chatId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/chat/session/${chatId}`);
    return response.data;
  },

  /**
   * Update chat title
   */
  updateChatTitle: async (chatId: string, title: string): Promise<void> => {
    await apiClient.patch(`/chat/session/${chatId}/title`, { title });
  },

  /**
   * Toggle pin chat
   */
  togglePinChat: async (chatId: string): Promise<{ isPinned: boolean }> => {
    const response = await apiClient.post(`/chat/session/${chatId}/pin`);
    return response.data;
  },

  /**
   * Clear chat history
   */
  clearChatHistory: async (chatId: string): Promise<{ message: string }> => {
    const response = await apiClient.post(`/chat/session/${chatId}/clear`);
    return response.data;
  },
};
