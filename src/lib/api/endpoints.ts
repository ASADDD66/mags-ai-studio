export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',

  PROJECTS: '/projects',
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
  PROJECT_CREATE: '/projects',
  PROJECT_UPDATE: (id: string) => `/projects/${id}`,
  PROJECT_DELETE: (id: string) => `/projects/${id}`,

  AGENTS: '/agents',
  AGENT_DETAIL: (id: string) => `/agents/${id}`,
  AGENT_CREATE: '/agents',
  AGENT_UPDATE: (id: string) => `/agents/${id}`,
  AGENT_DELETE: (id: string) => `/agents/${id}`,
  AGENT_DEPLOY: (id: string) => `/agents/${id}/deploy`,

  CHAT_MESSAGES: '/chat/messages',
  CHAT_SEND: '/chat/send',
  CHAT_HISTORY: '/chat/history',

  ACTIVITY: '/activity',
  ACTIVITY_DETAIL: (id: string) => `/activity/${id}`
}
