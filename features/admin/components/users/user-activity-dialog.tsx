
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconActivity, IconAlertTriangle, IconLogin, IconMessage, IconUserCheck } from "@tabler/icons-react"
import { UserProfile } from "../../api/interface"

interface UserActivityDialogProps {
    user: UserProfile
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    children?: React.ReactNode
}

// Mock activity data
const mockActivities = [
    {
        id: "1",
        action: "Login",
        description: "Logged in to the system",
        timestamp: "2024-02-14T08:30:00Z",
        icon: IconLogin,
        color: "text-blue-500 bg-blue-100 dark:bg-blue-950",
    },
    {
        id: "2",
        action: "Report Submitted",
        description: "Submitted accident report #ACC-2024-001",
        timestamp: "2024-02-13T14:45:00Z",
        icon: IconAlertTriangle,
        color: "text-orange-500 bg-orange-100 dark:bg-orange-950",
    },
    {
        id: "3",
        action: "Profile Update",
        description: "Updated contact information",
        timestamp: "2024-02-10T11:20:00Z",
        icon: IconUserCheck,
        color: "text-green-500 bg-green-100 dark:bg-green-950",
    },
    {
        id: "4",
        action: "Message Sent",
        description: "Sent message to Admin",
        timestamp: "2024-02-09T09:15:00Z",
        icon: IconMessage,
        color: "text-purple-500 bg-purple-100 dark:bg-purple-950",
    },
    {
        id: "5",
        action: "Login",
        description: "Logged in to the system",
        timestamp: "2024-02-08T08:35:00Z",
        icon: IconLogin,
        color: "text-blue-500 bg-blue-100 dark:bg-blue-950",
    },
]

export function UserActivityDialog({ user, isOpen, onOpenChange, children }: UserActivityDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconActivity className="size-5" />
                        User Activity
                    </DialogTitle>
                    <DialogDescription>
                        Recent activity history for <span className="font-medium text-foreground">{user.name}</span>.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6 pl-2 pt-2">
                        {mockActivities.map((activity) => (
                            <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 border-l border-border last:border-0">
                                <div className={`absolute -left-[13px] p-1 rounded-full ${activity.color} border border-background`}>
                                    <activity.icon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{activity.action}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {activity.description}
                                    </p>
                                    <span className="text-xs text-muted-foreground/60">
                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
