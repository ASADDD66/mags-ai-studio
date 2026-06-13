import { io, Socket } from 'socket.io-client';
import { tokenManager } from './token-manager';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class WebSocketClient {
  private socket: Socket | null = null;
  private connected = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = tokenManager.getAccessToken();

      if (!token) {
        reject(new Error('No authentication token available'));
        return;
      }

      this.socket = io(WEBSOCKET_URL, {
        namespace: '/chat',
        auth: {
          token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connected', () => {
        this.connected = true;
        resolve();
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
      });

      this.socket.on('connect_error', (error) => {
        reject(error);
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Chat events
  sendMessage(chatId: string, content: string): void {
    if (!this.socket) throw new Error('WebSocket not connected');
    this.socket.emit('chat:send', { chatId, content });
  }

  editMessage(messageId: string, content: string): void {
    if (!this.socket) throw new Error('WebSocket not connected');
    this.socket.emit('chat:edit', { messageId, content });
  }

  sendTypingIndicator(chatId: string, isTyping: boolean): void {
    if (!this.socket) throw new Error('WebSocket not connected');
    this.socket.emit('chat:typing', { chatId, isTyping });
  }

  // Event listeners
  onStreamStart(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:stream:start', callback);
  }

  onStreamChunk(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:stream:chunk', callback);
  }

  onStreamComplete(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:stream:complete', callback);
  }

  onMessageCreated(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:message:created', callback);
  }

  onMessageUpdated(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:message:updated', callback);
  }

  onTypingUpdate(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:typing:update', callback);
  }

  onError(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:error', callback);
  }

  // Cleanup
  offStreamStart(): void {
    if (this.socket) this.socket.off('chat:stream:start');
  }

  offStreamChunk(): void {
    if (this.socket) this.socket.off('chat:stream:chunk');
  }

  offStreamComplete(): void {
    if (this.socket) this.socket.off('chat:stream:complete');
  }

  offMessageCreated(): void {
    if (this.socket) this.socket.off('chat:message:created');
  }

  offMessageUpdated(): void {
    if (this.socket) this.socket.off('chat:message:updated');
  }

  offTypingUpdate(): void {
    if (this.socket) this.socket.off('chat:typing:update');
  }

  offError(): void {
    if (this.socket) this.socket.off('chat:error');
  }
}

export const wsClient = new WebSocketClient();
