export type Theme = 'dark' | 'light' | 'system'

export const THEME_CONFIG = {
  dark: {
    name: 'Dark',
    colors: {
      primary: '#4F46E5',
      secondary: '#1F2937',
      background: '#0F172A',
      card: '#1E293B'
    }
  },
  light: {
    name: 'Light',
    colors: {
      primary: '#4F46E5',
      secondary: '#F3F4F6',
      background: '#FFFFFF',
      card: '#F9FAFB'
    }
  }
}

export function getThemeColor(theme: Theme, colorKey: keyof typeof THEME_CONFIG.dark.colors) {
  const selectedTheme = theme === 'system' ? 'dark' : theme
  return THEME_CONFIG[selectedTheme].colors[colorKey]
}