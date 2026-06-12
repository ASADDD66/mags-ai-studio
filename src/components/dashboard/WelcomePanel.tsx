'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export function WelcomePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardHeader className="-mt-16 relative">
          <CardTitle className="text-3xl">Welcome back, Muntaha! 👋</CardTitle>
          <CardDescription>
            You're all set to start building amazing AI applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Button variant="default" className="gap-2">
              <Icons.Plus className="h-4 w-4" />
              New Project
            </Button>
            <Button variant="outline" className="gap-2">
              <Icons.BookOpen className="h-4 w-4" />
              Documentation
            </Button>
            <Button variant="outline" className="gap-2">
              <Icons.Zap className="h-4 w-4" />
              Create Agent
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
