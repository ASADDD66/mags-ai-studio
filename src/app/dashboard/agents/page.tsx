'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'

const agentTypes = {
  classification: 'bg-blue-500/10 text-blue-500',
  generation: 'bg-purple-500/10 text-purple-500',
  analysis: 'bg-green-500/10 text-green-500',
  custom: 'bg-orange-500/10 text-orange-500'
}

export default function AgentsPage() {
  const [agents, setAgents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Deploy and manage your AI agents</p>
        </div>
        <Button className="gap-2">
          <Icons.Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <EmptyState
          title="No agents yet"
          description="Create your first AI agent to start processing data"
          action={{ label: 'Create Agent', onClick: () => {} }}
          icon="⚡"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
        </motion.div>
      )}
    </div>
  )
}
