


import React from 'react'
import ProtectedResponder from '@/components/ProtectedResponder'

export default function ResponderLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedResponder>{children}</ProtectedResponder>
    )
}
