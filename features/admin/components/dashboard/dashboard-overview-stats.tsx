"use client"

import { IconAlertTriangle, IconClock, IconMapPin, IconUsers, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export function DashboardOverviewStats() {
    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card border-l-4 border-l-red-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconAlertTriangle className="size-4 text-red-500" />
                        Total Incidents
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        12
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950">
                            <IconTrendingUp className="size-3 text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400">+3 today</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Reported this week
                    </div>
                    <div className="text-muted-foreground">
                        4 critical, 3 high, 3 moderate, 2 minor
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-orange-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconClock className="size-4 text-orange-500" />
                        Avg Response Time
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        9.8 min
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                            <IconTrendingDown className="size-3 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400">-2.3 min</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Improved from last week
                    </div>
                    <div className="text-muted-foreground">
                        Target: &lt;10 minutes
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconMapPin className="size-4 text-blue-500" />
                        Active Locations
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        8
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                            <span className="text-blue-600 dark:text-blue-400">Metro Manila</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Municipalities affected
                    </div>
                    <div className="text-muted-foreground">
                        Across 12 barangays
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-green-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconUsers className="size-4 text-green-500" />
                        Active Responders
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        15
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                            <span className="text-green-600 dark:text-green-400">Online</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        LGU & BLGU officials
                    </div>
                    <div className="text-muted-foreground">
                        Ready to respond
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
