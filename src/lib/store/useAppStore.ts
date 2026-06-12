import { create } from 'zustand'
import type { User, Project, Agent } from '@/types'

interface AppState {
  currentUser: User | null
  currentProject: Project | null
  selectedAgent: Agent | null
  isLoading: boolean

  setCurrentUser: (user: User | null) => void
  setCurrentProject: (project: Project | null) => void
  setSelectedAgent: (agent: Agent | null) => void
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  currentProject: null,
  selectedAgent: null,
  isLoading: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setIsLoading: (loading) => set({ isLoading: loading })
}))
