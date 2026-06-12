'use client'

import React, { useState } from 'react'
import { useUIStore } from '@/lib/store/useUIStore'
import { useNavigation } from '@/hooks/useNavigation'
import { COMMAND_PALETTE_ITEMS } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'
import * as Icons from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/Input'

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const { navigate } = useNavigation()
  const [search, setSearch] = useState('')

  const filtered = COMMAND_PALETTE_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce(
    (acc, item) => {
      const group = item.category
      if (!acc[group]) acc[group] = []
      acc[group].push(item)
      return acc
    },
    {} as Record<string, typeof COMMAND_PALETTE_ITEMS>
  )

  const handleSelect = (item: (typeof COMMAND_PALETTE_ITEMS)[0]) => {
    setCommandPaletteOpen(false)
    if (item.label === 'Dashboard') navigate('/dashboard')
    if (item.label === 'Projects') navigate('/dashboard/projects')
    if (item.label === 'Agents') navigate('/dashboard/agents')
    if (item.label === 'Chat') navigate('/dashboard/chat')
    if (item.label === 'Settings') navigate('/dashboard/settings')
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-lg border border-border bg-card shadow-2xl">
              <div className="flex items-center border-b border-border px-4">
                <Icons.Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search commands..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                      {category}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between rounded px-2 py-2 text-sm hover:bg-secondary"
                      >
                        <span>{item.label}</span>
                        <kbd className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {item.shortcut}
                        </kbd>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
