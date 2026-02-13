

import React from 'react'
import ProtectedAdmin from '@/components/ProtectedAdmin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return <ProtectedAdmin>{children}</ProtectedAdmin>
}
