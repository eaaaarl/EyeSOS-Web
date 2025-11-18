'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  useEffect(() => {
    if (user) {
      router.replace('/map')
    }
  }, [user, router])

  if (!user) {
    return <>{children}</>
  }

  return null
}