import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  commandPaletteOpen: boolean
  userMenuOpen: boolean
  notificationsOpen: boolean
  mobileMenuOpen: boolean

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleUserMenu: () => void
  setUserMenuOpen: (open: boolean) => void
  toggleNotifications: () => void
  setNotificationsOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setMobileMenuOpen: (open: boolean) => void
  closeAllMenus: () => void
}

export const useUIStore = create<UIState>()()
  persist(
    (set) => ({
      sidebarOpen: true,
      commandPaletteOpen: false,
      userMenuOpen: false,
      notificationsOpen: false,
      mobileMenuOpen: false,

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      toggleUserMenu: () => set((state) => ({ userMenuOpen: !state.userMenuOpen })),
      setUserMenuOpen: (open) => set({ userMenuOpen: open }),

      toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),

      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      closeAllMenus: () =>
        set({
          userMenuOpen: false,
          notificationsOpen: false,
          mobileMenuOpen: false
        })
    }),
    {
      name: 'ui-store'
    }
  )
)