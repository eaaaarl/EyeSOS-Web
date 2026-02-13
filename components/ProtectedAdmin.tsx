'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReactNode } from 'react'

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
    const router = useRouter()
    const profile = useAppSelector(state => state.auth.profile)
    const isLoading = useAppSelector(state => state.auth.isLoading)
    const [isChecking, setIsChecking] = useState(true)


    useEffect(() => {

        if (!isLoading) {
            if (!profile || profile.user_type !== 'admin') {
                router.replace('/map')
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setIsChecking(false)
            }
        }
    }, [profile, router, isLoading])

    if (isLoading || isChecking) {
        return null
    }

    if (!profile || profile.user_type !== 'admin') {
        return null
    }

    return <>{children}</>
}