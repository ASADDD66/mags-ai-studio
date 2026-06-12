export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    href: '/dashboard',
    badge: null
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'Folder',
    href: '/dashboard/projects',
    badge: null
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: 'Zap',
    href: '/dashboard/agents',
    badge: 3
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: 'MessageSquare',
    href: '/dashboard/chat',
    badge: null
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/dashboard/settings',
    badge: null
  }
]

export const COMMAND_PALETTE_ITEMS = [
  { id: '1', label: 'Dashboard', shortcut: '⌘D', category: 'Navigation' },
  { id: '2', label: 'Projects', shortcut: '⌘P', category: 'Navigation' },
  { id: '3', label: 'Agents', shortcut: '⌘A', category: 'Navigation' },
  { id: '4', label: 'Chat', shortcut: '⌘C', category: 'Navigation' },
  { id: '5', label: 'Settings', shortcut: '⌘,', category: 'Navigation' },
  { id: '6', label: 'Toggle Dark Mode', shortcut: '⌘K', category: 'Theme' },
  { id: '7', label: 'Logout', shortcut: '⌘Q', category: 'Account' }
]

export const STATS_OVERVIEW = [
  { label: 'Total Projects', value: '12', change: '+2.5%', icon: 'Folder' },
  { label: 'Active Agents', value: '8', change: '+1.2%', icon: 'Zap' },
  { label: 'API Calls Today', value: '2.4K', change: '+12%', icon: 'TrendingUp' },
  { label: 'Uptime', value: '99.9%', change: '+0.1%', icon: 'Activity' }
]

export const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'project_created',
    title: 'Created new project',
    description: 'AI Content Generator v2.0',
    timestamp: '2 hours ago',
    icon: 'Folder'
  },
  {
    id: '2',
    type: 'agent_deployed',
    title: 'Agent deployed successfully',
    description: 'Email Classification Agent',
    timestamp: '4 hours ago',
    icon: 'Zap'
  },
  {
    id: '3',
    type: 'api_call',
    title: '1000 API calls executed',
    description: 'Text generation endpoints',
    timestamp: '1 day ago',
    icon: 'Code'
  }
]