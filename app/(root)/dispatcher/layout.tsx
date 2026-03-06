


import React from 'react'
import ProtectedDashboard from '@/components/ProtectedDashboard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedDashboard>{children}</ProtectedDashboard>
    )
}
