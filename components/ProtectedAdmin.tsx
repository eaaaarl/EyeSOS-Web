'use client'

import { useGetUserProfileQuery } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/lib/redux/hooks'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function ProtectedAdmin({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { user } = useAppSelector((state) => state.auth);
    const {
        data: profile,
        isLoading,
    } = useGetUserProfileQuery({ user_id: user?.id as string }, {
        skip: !user?.id
    });

    useEffect(() => {
        if (!user) {
            router.replace('/');
            return;
        }

        if (!isLoading && profile) {
            if (profile.profile.user_type === 'lgu' || profile.profile.user_type === 'blgu') {
                router.replace('/dashboard/map');
            }
            if (profile.profile.user_type === 'responder') {
                router.replace('/responder');
            }

            if (profile.profile.user_type === 'admin') {
                router.replace('/admin');
            }
        }

    }, [user, profile, isLoading, router]);


    if (!user || isLoading || !profile) {
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