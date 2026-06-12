'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useThemeStore } from '@/lib/store/useThemeStore'
import * as Icons from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="Muntaha Qureshi" className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="muntaha@mags.ai" className="mt-2" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Theme Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Theme</label>
            <div className="mt-2 flex gap-2">
              {['dark', 'light'].map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  onClick={() => setTheme(t as 'dark' | 'light')}
                  className="gap-2"
                >
                  {t === 'dark' ? <Icons.Moon className="h-4 w-4" /> : <Icons.Sun className="h-4 w-4" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for integration</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Generate New Key</Button>
        </CardContent>
      </Card>
    </div>
  )
}
