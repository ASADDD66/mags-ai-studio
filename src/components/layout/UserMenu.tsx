'use client'

import React from 'react'
import { useUIStore } from '@/lib/store/useUIStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import * as Icons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function UserMenu() {
  const { userMenuOpen, setUserMenuOpen } = useUIStore()

  const menuItems = [
    { label: 'Profile', icon: 'User' },
    { label: 'Settings', icon: 'Settings' },
    { label: 'Help', icon: 'HelpCircle' },
    { divider: true },
    { label: 'Logout', icon: 'LogOut', danger: true }
  ]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
        className="rounded-full"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600" />
      </Button>

      <AnimatePresence>
        {userMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0"
              onClick={() => setUserMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-12 w-48 rounded-lg border border-border bg-card shadow-lg"
            >
              <div className="p-3 space-y-1">
                {menuItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    {item.divider ? (
                      <div className="my-1 h-px bg-border" />
                    ) : (
                      <button
                        className={cn(
                          'w-full flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors',
                          item.danger
                            ? 'text-destructive hover:bg-destructive/10'
                            : 'text-foreground hover:bg-secondary'
                        )}
                      >
                        <span>{item.label}</span>
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
