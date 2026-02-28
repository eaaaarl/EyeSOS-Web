"use client"
import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from "next/link"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isActive}
                                    className={isActive
                                        ? "!bg-red-500/10 !text-red-600 !font-medium hover:!bg-red-500/20 hover:!text-red-700 dark:!bg-red-500/20 dark:!text-red-400 dark:hover:!bg-red-500/30 dark:hover:!text-red-300"
                                        : undefined
                                    }
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}