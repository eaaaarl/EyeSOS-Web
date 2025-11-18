'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)

  console.log(user)
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [router, user])

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>{children}</>
  )
}