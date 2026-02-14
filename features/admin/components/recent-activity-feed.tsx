"use client"

import { IconAlertTriangle, IconCheck, IconClock, IconMapPin } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const activities = [
    {
        id: 1,
        type: "new",
        severity: "critical",
        title: "Major accident reported",
        location: "EDSA-Ortigas, Quezon City",
        time: "5 minutes ago",
        reporter: "Maria Santos"
    },
    {
        id: 2,
        type: "resolved",
        severity: "moderate",
        title: "Incident resolved",
        location: "Ayala Avenue, Makati",
        time: "15 minutes ago",
        reporter: "Roberto Garcia"
    },
    {
        id: 3,
        type: "progress",
        severity: "high",
        title: "Response team dispatched",
        location: "Ortigas Avenue, Pasig",
        time: "32 minutes ago",
        reporter: "Elena Cruz"
    },
    {
        id: 4,
        type: "new",
        severity: "moderate",
        title: "Moderate accident reported",
        location: "Taft Avenue, Manila",
        time: "1 hour ago",
        reporter: "Jose Reyes"
    },
    {
        id: 5,
        type: "resolved",
        severity: "minor",
        title: "Incident resolved",
        location: "Shaw Boulevard, Mandaluyong",
        time: "2 hours ago",
        reporter: "Sofia Mendoza"
    },
]

function getActivityIcon(type: string) {
    switch (type) {
        case "new":
            return <IconAlertTriangle className="size-4 text-red-500" />
        case "resolved":
            return <IconCheck className="size-4 text-green-500" />
        case "progress":
            return <IconClock className="size-4 text-blue-500" />
        default:
            return <IconMapPin className="size-4" />
    }
}

function getSeverityColor(severity: string) {
    switch (severity) {
        case "critical":
            return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
        case "high":
            return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
        case "moderate":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
        case "minor":
            return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
}

export function RecentActivityFeed() {
    return (
        <Card className="mx-4 lg:mx-6">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest incident reports and updates
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="mt-1">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{activity.title}</p>
                                        <Badge className={getSeverityColor(activity.severity)}>
                                            {activity.severity}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <IconMapPin className="size-3" />
                                        {activity.location}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Reported by {activity.reporter}</span>
                                        <span>{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
