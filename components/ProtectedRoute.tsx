'use client'
import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  const { data: profile, isLoading } = useGetUserProfileQuery({ user_id: user?.id as string }, {
    skip: !user?.id
  });
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
  }, [router, user])


  if (!user || isLoading || !profile) {
    return <div>Loading...</div>
  }



  return <>{children}</>
}