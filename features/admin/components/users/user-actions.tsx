
"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconActivity, IconDotsVertical, IconEdit, IconMessage, IconTrash, IconUser } from "@tabler/icons-react"
import { UserProfile } from "../../api/interface"
import { EditUserDialog } from "./edit-user-dialog"
import { ChangeUserRoleDialog } from "./change-user-role-dialog"
import { UserActivityDialog } from "./user-activity-dialog"
import { UserDetailsDialog } from "./user-details-dialog"

interface UserActionsProps {
    user: UserProfile
}

export function UserActions({ user }: UserActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [showActivityDialog, setShowActivityDialog] = useState(false)
    const [showRoleDialog, setShowRoleDialog] = useState(false)

    return (
        <div className="flex items-center gap-1">
            <UserDetailsDialog user={user} />
            <EditUserDialog
                user={user}
                isOpen={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
            <UserActivityDialog
                user={user}
                isOpen={showActivityDialog}
                onOpenChange={setShowActivityDialog}
            />
            <ChangeUserRoleDialog
                user={user}
                isOpen={showRoleDialog}
                onOpenChange={setShowRoleDialog}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        <IconEdit className="mr-2 size-4" />
                        Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem><IconMessage className="mr-2 size-4" />Send Message</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setShowActivityDialog(true)}>
                        <IconActivity className="mr-2 size-4" />
                        View Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowRoleDialog(true)}>
                        <IconUser className="mr-2 size-4" />
                        Change Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                        <IconTrash className="mr-2 size-4" />
                        Deactivate
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
