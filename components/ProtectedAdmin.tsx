'use client'

import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth);
    const { data: profile, isLoading } = useGetUserProfileQuery({ user_id: user?.id as string }, {
        skip: !user?.id
    });

    useEffect(() => {
        if (!user) {
            router.replace('/');
            return;
        }

        if (!isLoading && profile) {
            if (profile.profile.user_type !== 'admin') {
                router.replace('/map');
            }
        }
    }, [user, profile, isLoading, router]);


    if (!user || isLoading || !profile) {
        return <div>Loading...</div>
    }

    return <>{children}</>
}