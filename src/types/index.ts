export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'paused' | 'archived'
  createdAt: Date
  updatedAt: Date
  owner: User
}

export interface Agent {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'training'
  type: 'classification' | 'generation' | 'analysis' | 'custom'
  createdAt: Date
  project: Project
}

export interface ActivityItem {
  id: string
  type: 'project_created' | 'agent_deployed' | 'api_call' | 'error'
  title: string
  description: string
  timestamp: string
  icon: string
  metadata?: Record<string, any>
}

export interface StatsCard {
  label: string
  value: string | number
  change: string
  icon: string
  trend?: 'up' | 'down'
}