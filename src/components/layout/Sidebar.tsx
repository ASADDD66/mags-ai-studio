'use client'

import React from 'react'
import Link from 'next/link'
import { useNavigation } from '@/hooks/useNavigation'
import { useUIStore } from '@/lib/store/useUIStore'
import { NAVIGATION_ITEMS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'
import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'

export function Sidebar() {
  const { isActive } = useNavigation()
  const { sidebarOpen } = useUIStore()

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: sidebarOpen ? 0 : -260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-card p-4',
        'md:relative md:translate-x-0',
        'overflow-y-auto'
      )}
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
        <span className="font-bold text-lg">MAGS</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {NAVIGATION_ITEMS.map((item) => {
          const IconComponent = Icons[item.icon as keyof typeof Icons] as React.ElementType
          const active = isActive(item.href)

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-foreground hover:bg-secondary'
              )}
            >
              <IconComponent className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="my-4 h-px bg-border" />

      {/* Bottom Section */}
      <div className="space-y-2 text-xs text-muted-foreground">
        <p>Version 1.0.0</p>
        <p>© 2024 MAGS AI Studio</p>
      </div>
    </motion.aside>
  )
}
