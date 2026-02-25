'use client'
import { useAppSelector } from '@/lib/redux/hooks'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const pathname = usePathname()

  const isRecoveryFlow = pathname === "/reset-password" || pathname === "/forgot-password"

  useEffect(() => {
    // Don't redirect if we are on a recovery-related page
    // as we want to maintain the "guest" view while the user finishes the flow
    if (user && !isRecoveryFlow) {
      router.replace('/map')
    }
  }, [user, router, pathname, isRecoveryFlow])

  if (!user || isRecoveryFlow) {
    return <>{children}</>
  }

  return null
}