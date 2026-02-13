'use client'
import { useAppSelector } from '@/lib/redux/hooks'
import React from 'react'

export default function AdminPage() {
    // Option 2: Get specific fields
    const { profile, user } = useAppSelector((state) => state.auth)

    console.log('profile', profile)
    console.log('user', user)

    return (
        <div className='p-4 bg-white'>
            <h2 className='font-bold mb-4'>Profile:</h2>
            <pre>{JSON.stringify(profile, null, 2)}</pre>

            <h2 className='font-bold mb-4 mt-4'>User:</h2>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}