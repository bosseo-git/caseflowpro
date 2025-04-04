import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export function useUser({
  redirectTo = '',
  redirectIfFound = false,
} = {}) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (!redirectTo || loading) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !session?.user) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && session?.user)
    ) {
      router.push(redirectTo)
    }
  }, [redirectTo, redirectIfFound, loading, session, router])

  useEffect(() => {
    if (loading || !session?.user?.id) return
    
    // Fetch user data from the API
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/settings')
        const userData = await res.json()
        setUser(userData)
      } catch (error) {
        console.error('Failed to fetch user data', error)
      }
    }

    fetchUser()
  }, [loading, session])

  return {
    user,
    loading,
    isLoggedIn: !!session?.user,
  }
} 