'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMessageStore } from '@/stores/message.store';
import { wsClient } from '@/lib/websocket';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface MessageInputProps {
  chatId: string;
}

export function MessageInput({ chatId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, startStreaming, addStreamToken, completeStreaming, isStreaming } =
    useMessageStore();

  useEffect(() => {
    // Setup WebSocket listeners
    wsClient.onStreamStart((data) => {
      const tempMessage = {
        tempId: data.messageId,
        chatId,
        role: 'assistant' as const,
        content: '',
        isStreaming: true,
        createdAt: new Date(),
      };
      addMessage(tempMessage);
      startStreaming(data.messageId);
    });

    wsClient.onStreamChunk((data) => {
      addStreamToken(data.messageId, data.token);
    });

    wsClient.onStreamComplete((data) => {
      const completedMessage = {
        id: data.messageId,
        chatId,
        role: 'assistant' as const,
        content: data.content,
        tokens: data.tokens,
        isStreaming: false,
        isEdited: false,
        createdAt: new Date(),
      };
      completeStreaming(data.messageId, completedMessage);
    });

    wsClient.onError((data) => {
      console.error('Chat error:', data.error);
      setIsSubmitting(false);
    });

    return () => {
      wsClient.offStreamStart();
      wsClient.offStreamChunk();
      wsClient.offStreamComplete();
      wsClient.offError();
    };
  }, [chatId, addMessage, startStreaming, addStreamToken, completeStreaming]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting || isStreaming) {
      return;
    }

    try {
      setIsSubmitting(true);
      setIsTyping(false);

      // Add user message to UI
      addMessage({
        id: `user_${Date.now()}`,
        chatId,
        role: 'user',
        content: content.trim(),
        isStreaming: false,
        isEdited: false,
        createdAt: new Date(),
      });

      // Send via WebSocket
      wsClient.sendMessage(chatId, content.trim());

      // Clear input
      setContent('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }

    // Send typing indicator
    setIsTyping(true);
    wsClient.sendTypingIndicator(chatId, true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSendMessage(e as any);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSendMessage}
      className="border-t border-slate-700 bg-slate-800 p-4"
    >
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Ctrl+Enter to send)"
            disabled={isSubmitting || isStreaming}
            rows={1}
            className="w-full max-h-52 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition"
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim() || isSubmitting || isStreaming}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
        >
          {isSubmitting || isStreaming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </>
          ) : (
            <>
              <span>Send</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Tip: Press <kbd className="bg-slate-700 px-1 rounded">Ctrl+Enter</kbd> to send
      </p>
    </motion.form>
  );
}
