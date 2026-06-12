import { useRouter, usePathname } from 'next/navigation'

export function useNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const navigate = (href: string) => {
    router.push(href)
  }

  return { isActive, navigate, pathname }
}
