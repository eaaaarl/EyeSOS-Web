'use client'
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, profile, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user && profile) { // ✅ Check both exist
        if (profile.user_type === 'admin') {
          router.replace('/admin')
        } else {
          router.replace('/map')
        }
      }
      // If no user, stay on login page (don't redirect)
    }
  }, [user, profile, router, isLoading])

  // Show login page while loading or if no user
  if (isLoading || !user) {
    return <>{children}</>
  }

  // User is logged in, redirecting...
  return null
}