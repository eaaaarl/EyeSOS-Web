'use client'

import React from 'react'
import ProtectedAdmin from '@/components/ProtectedAdmin'
import { AppSidebar } from '@/features/admin/components/layouts/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return <ProtectedAdmin>
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    </ProtectedAdmin>
}
