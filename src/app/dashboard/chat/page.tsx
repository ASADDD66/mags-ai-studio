'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import * as Icons from 'lucide-react'

export default function ChatPage() {
  const [messages, setMessages] = React.useState<any[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?'
    }
  ])
  const [input, setInput] = React.useState('')

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([
      ...messages,
      { id: Date.now().toString(), role: 'user', content: input },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I received your message. This is a placeholder response.'
      }
    ])
    setInput('')
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={msg.role === 'user' ? 'bg-primary text-primary-foreground' : ''}>
              <CardContent className="p-4">
                <p>{msg.content}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="m-4">
        <CardContent className="flex gap-2 p-4">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Icons.Send className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
