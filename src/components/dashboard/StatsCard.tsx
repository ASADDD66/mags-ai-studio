'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { StatsCard as StatsCardType } from '@/types'

interface Props extends StatsCardType {
  index: number
}

export function StatsCard({ label, value, change, icon, index }: Props) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ElementType

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
              <p className="mt-2 text-sm text-green-500">{change}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
