import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { apiClient } from './client'
import { API_ENDPOINTS } from './endpoints'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Project, Agent, User } from '@/types'

export function useProjects(): UseQueryResult<PaginatedResponse<Project>, Error> {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Project>>(API_ENDPOINTS.PROJECTS)
      if (!response.success) throw new Error(response.error)
      return response.data!
    }
  })
}

export function useProject(id: string): UseQueryResult<Project, Error> {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await apiClient.get<Project>(API_ENDPOINTS.PROJECT_DETAIL(id))
      if (!response.success) throw new Error(response.error)
      return response.data!
    }
  })
}

export function useAgents(): UseQueryResult<Agent[], Error> {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await apiClient.get<Agent[]>(API_ENDPOINTS.AGENTS)
      if (!response.success) throw new Error(response.error)
      return response.data!
    }
  })
}

export function useAgent(id: string): UseQueryResult<Agent, Error> {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const response = await apiClient.get<Agent>(API_ENDPOINTS.AGENT_DETAIL(id))
      if (!response.success) throw new Error(response.error)
      return response.data!
    }
  })
}

export function useCurrentUser(): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<User>(API_ENDPOINTS.ME)
      if (!response.success) throw new Error(response.error)
      return response.data!
    }
  })
}
