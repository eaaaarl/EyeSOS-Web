import { IconAlertTriangle, IconMapPin, IconClock, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton"

interface AccidentStatsCardsProps {
    countTotalReport: number;
    countActiveReport?: number;
    countResolvedReport?: number;
    countIncidents?: number;
    countResolvedToday?: number;
    countAvgResponseTime?: number;

    isLoading?: boolean;
    isError?: boolean;
}

export function AccidentStatsCards({
    countTotalReport,
    countActiveReport,
    countResolvedReport,
    countResolvedToday,
    countAvgResponseTime,
    isError,
    isLoading
}: AccidentStatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-l-4">
                        <CardHeader>
                            <CardDescription><Skeleton className="h-4 w-24" /></CardDescription>
                            <CardTitle><Skeleton className="h-8 w-16" /></CardTitle>
                        </CardHeader>
                        <CardFooter><Skeleton className="h-4 w-32" /></CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card border-l-4 border-l-red-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconAlertTriangle className="size-4 text-red-500" />
                        Total Reports
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {countTotalReport}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950">
                            <IconTrendingUp className="text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400">+{countResolvedToday} today</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Active emergency reports
                    </div>
                    <div className="text-muted-foreground">
                        Last 24 hours activity
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
                        {countAvgResponseTime?.toFixed(1) || 0} min
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Improved performance
                    </div>
                    <div className="text-muted-foreground">
                        Time from report to acceptance
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconMapPin className="size-4 text-blue-500" />
                        Active Incidents
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {countActiveReport}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                            <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Ongoing emergency response
                    </div>
                    <div className="text-muted-foreground">
                        New emergency reports
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-green-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconAlertTriangle className="size-4 text-green-500" />
                        Resolved Count
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {countResolvedReport}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                            <span className="text-green-600 dark:text-green-400">Life time</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Strong resolution rate
                    </div>
                    <div className="text-muted-foreground">
                        Above target metrics
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
