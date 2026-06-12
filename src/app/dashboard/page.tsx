'use client'

import React from 'react'
import { WelcomePanel } from '@/components/dashboard/WelcomePanel'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard'
import { STATS_OVERVIEW, RECENT_ACTIVITY } from '@/lib/utils/constants'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomePanel />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {STATS_OVERVIEW.map((stat, index) => (
          <StatsCard key={stat.label} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivityCard activities={RECENT_ACTIVITY} />
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Today's Requests</span>
              <span className="font-medium">2.4K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-medium">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response</span>
              <span className="font-medium">234ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
