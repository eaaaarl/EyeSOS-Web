'use client'

import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isSigningIn } = useAppSelector((state) => state.auth)
  const { data: profileData, isLoading } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id || isSigningIn }
  );
  const router = useRouter()

  const pathname = usePathname()

  const isRecoveryFlow = pathname === "/reset-password" || pathname === "/forgot-password"

  useEffect(() => {
    // Don't redirect if we are on a recovery-related page
    // as we want to maintain the "guest" view while the user finishes the flow
    // Also don't redirect while signing in to prevent flickering
    if (user && !isRecoveryFlow && !isLoading && profileData && !isSigningIn) {
      const userType = profileData.profile.user_type;
      // Redirect authorized user types to their respective dashboards
      if (userType === 'lgu' || userType === 'blgu') {
        router.replace('/dashboard/map');
      } else if (userType === 'admin') {
        router.replace('/admin');
      } else if (userType === 'responder') {
        router.replace('/responder');
      } else {
        // For unauthorized types, just clear the session (already signed out in mutation)
        // Don't redirect, just let the error show on the login form
      }
    }
  }, [user, router, pathname, isRecoveryFlow, isLoading, profileData, isSigningIn])

  // Always show children (login form) - redirects happen via router.replace() without unmounting
  return <>{children}</>
}