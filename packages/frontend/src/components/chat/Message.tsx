'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ChatMessage, StreamingMessage } from '@/types/message';

interface MessageProps {
  message: ChatMessage | StreamingMessage;
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isStreaming = 'isStreaming' in message && message.isStreaming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-2xl rounded-lg p-4 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-slate-700 text-gray-100 rounded-bl-none'
        } shadow-lg`}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';

                if (inline) {
                  return (
                    <code className="bg-slate-900 px-1 py-0.5 rounded text-orange-400">
                      {children}
                    </code>
                  );
                }

                return (
                  <div className="bg-slate-900 rounded overflow-auto my-2">
                    <SyntaxHighlighter
                      language={language}
                      style={oneDark}
                      className="!m-0 !p-3 text-sm"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="text-xs mt-2 opacity-60 flex items-center gap-2">
          {isStreaming && <span className="animate-pulse">●</span>}
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
