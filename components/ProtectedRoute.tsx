'use client'
import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useRef } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAppSelector((state) => state.auth)
  const { data: profile, isLoading } = useGetUserProfileQuery({ user_id: user?.id as string }, {
    skip: !user?.id
  });

  const router = useRouter()
  const pathname = usePathname()
  const hasRedirected = useRef(false)

  const isAdmin = profile?.profile.user_type === 'admin'
  const isOnAdminPage = pathname?.startsWith('/admin')
  console.log('user', user)
  console.log('profile', profile)
  useEffect(() => {
    if (!user) {
      router.replace('/')
      return
    }

    if (!isLoading && isAdmin && !isOnAdminPage && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/admin');
    }

  }, [router, user, isAdmin, isLoading, isOnAdminPage, profile])

  if (!user || isLoading || !profile || (isAdmin && !isOnAdminPage)) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="flex flex-col items-center gap-4 ">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Splash Screen Logo"
              width={500}
              height={500}
              className="animate-pulse"
              priority
            />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}