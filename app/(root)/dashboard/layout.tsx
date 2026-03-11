

import ProtectedAdmin from '@/components/ProtectedAdmin'
import React from 'react'

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedAdmin>{children}</ProtectedAdmin>
    )
}

export default AdminLayout