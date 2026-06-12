'use client'

import React from 'react'
import { useUIStore } from '@/lib/store/useUIStore'
import { cn } from '@/lib/utils/cn'
import * as Icons from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { UserMenu } from './UserMenu'

export function Topbar() {
  const { setCommandPaletteOpen, setSidebarOpen, sidebarOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <Icons.Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative hidden w-96 md:flex">
            <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, agents..."
              className="pl-10 pr-4"
              onClick={() => setCommandPaletteOpen(true)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Command Palette */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden"
          >
            <Icons.Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icons.Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
