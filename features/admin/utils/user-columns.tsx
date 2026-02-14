
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from "@tabler/icons-react"
import { UserProfile } from "../api/interface"
import { getUserTypeColor, getUserTypeIcon, getUserTypeLabel } from "../helpers/user-type-helpers"
import { UserDetailsDialog } from "../components/user-details-dialog"

export const columns: ColumnDef<UserProfile>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Avatar className="size-10">
                    {row.original.avatarUrl ? (
                        <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
                    ) : (
                        <AvatarFallback>{row.original.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    )}
                </Avatar>
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-muted-foreground text-xs">{row.original.email}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "user_type",
        header: "Type",
        cell: ({ row }) => (
            <Badge className={getUserTypeColor(row.original.user_type)}>
                {getUserTypeIcon(row.original.user_type)}
                {getUserTypeLabel(row.original.user_type)}
            </Badge>
        ),
    },
    {
        accessorKey: "mobileNo",
        header: "Contact",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.mobileNo}</div>
        ),
    },
    {
        accessorKey: "permanent_address",
        header: "Location",
        cell: ({ row }) => (
            <div className="max-w-xs">
                <div className="text-sm truncate">{row.original.permanent_address}</div>
            </div>
        ),
    },
    {
        accessorKey: "organizations_id",
        header: "Organization",
        cell: ({ row }) => (
            <div className="text-xs font-mono">{row.original.organizations_id || 'N/A'}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <UserDetailsDialog user={row.original} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Activity</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]
