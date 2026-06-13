import { useEffect, useState, useCallback } from 'react';
import { wsClient } from '@/lib/websocket';

interface WebSocketEvent {
  type: string;
  data: any;
}

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      try {
        await wsClient.connect();
        setConnected(true);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setConnected(false);
      }
    };

    connect();

    return () => {
      wsClient.disconnect();
      setConnected(false);
    };
  }, []);

  const sendMessage = useCallback((chatId: string, content: string) => {
    if (!connected) {
      setError('WebSocket not connected');
      return;
    }

    try {
      wsClient.sendMessage(chatId, content);
    } catch (err: any) {
      setError(err.message);
    }
  }, [connected]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    switch (event) {
      case 'stream:start':
        wsClient.onStreamStart(callback);
        break;
      case 'stream:chunk':
        wsClient.onStreamChunk(callback);
        break;
      case 'stream:complete':
        wsClient.onStreamComplete(callback);
        break;
      default:
        break;
    }
  }, []);

  return {
    connected,
    error,
    sendMessage,
    subscribe,
  };
}