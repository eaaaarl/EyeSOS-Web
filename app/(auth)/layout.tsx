'use client'

import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  const { data: profileData, isLoading } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );
  const router = useRouter()

  const pathname = usePathname()

  const isRecoveryFlow = pathname === "/reset-password" || pathname === "/forgot-password"

  useEffect(() => {
    // Don't redirect if we are on a recovery-related page
    // as we want to maintain the "guest" view while the user finishes the flow
    if (user && !isRecoveryFlow && !isLoading && profileData) {
      const userType = profileData.profile.user_type;
      if (userType === 'lgu' || userType === 'blgu') {
        router.replace('/dashboard/map');
      } else if (userType === 'responder') {
        router.replace('/responder/map');
      } else if (userType === 'admin') {
        router.replace('/admin');
      }
    }
  }, [user, router, pathname, isRecoveryFlow, isLoading, profileData])

  if (!user || isRecoveryFlow) {
    return <>{children}</>
  }

  return null
}