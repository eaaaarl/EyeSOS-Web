'use client'
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ReactNode } from 'react'

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { profile, isLoading } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (!isLoading) {
            if (!profile || profile.user_type !== 'admin') {
                router.replace('/map')
            }
        }
    }, [profile, router, isLoading])

    if (isLoading) {
        return null // Or loading spinner
    }

    if (!profile || profile.user_type !== 'admin') {
        return null
    }

    return <>{children}</>
}