'use client'
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/')
    }
  }, [router, user, isLoading])

  if (isLoading) {
    return null
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}