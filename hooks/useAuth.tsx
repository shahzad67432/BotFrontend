// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const storedToken = localStorage.getItem('auth_token')
    setToken(storedToken)
    setIsLoading(false)

    // Optional: Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        setToken(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { token, isLoading, isAuthenticated: !!token }
}