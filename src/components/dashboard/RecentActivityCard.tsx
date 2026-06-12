'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  icon: string
}

interface Props {
  activities: ActivityItem[]
}

export function RecentActivityCard({ activities }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = Icons[activity.icon as keyof typeof Icons] as React.ElementType
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-secondary transition-colors"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
