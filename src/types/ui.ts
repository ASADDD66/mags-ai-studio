export interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  badge?: number | null
  children?: NavItem[]
}

export interface CommandItem {
  id: string
  label: string
  shortcut: string
  category: string
  action?: () => void
}

export interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  userMenuOpen: boolean
  notificationsOpen: boolean
}