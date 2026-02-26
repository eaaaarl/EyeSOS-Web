"use client"

import * as React from "react"
import {
    IconDashboard,
    IconInnerShadowTop,
    IconReport,
    IconUsers,
    IconSettings,
    IconHelp,
} from "@tabler/icons-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import Link from "next/link"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: IconDashboard,
        },
        {
            title: "Users",
            url: "/admin/users",
            icon: IconUsers,
        },
        {
            title: "Accidents Report",
            url: "/admin/accidents",
            icon: IconReport,
        },
        {
            title: "Live Map",
            url: "/dashboard/map",
            icon: IconInnerShadowTop, // Or use IconMap if available
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Help",
            url: "#",
            icon: IconHelp,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href="/admin">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">EyeSOS</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
