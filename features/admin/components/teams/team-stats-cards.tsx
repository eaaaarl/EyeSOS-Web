"use client"

import { IconUsers, IconUserCheck, IconAlertTriangle, IconChartBar } from "@tabler/icons-react"

import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Skeleton } from "@/components/ui/skeleton";

export interface Team {
    id: string;
    name: string;
    leader: string;
    membersCount: number;
    status: 'active' | 'inactive' | 'on-call';
    performance: number;
    createdAt: string;
}

interface TeamStatsCardsProps {
    data: Team[];
    isLoading?: boolean;
}

export function TeamStatsCards({ data, isLoading }: TeamStatsCardsProps) {
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

    const totalTeams = data.length;
    const activeTeams = data.filter(team => team.status === 'active').length;
    const onCallTeams = data.filter(team => team.status === 'on-call').length;
    const avgPerformance = totalTeams > 0
        ? Math.round(data.reduce((acc, team) => acc + team.performance, 0) / totalTeams)
        : 0;

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconUsers className="size-4 text-blue-500" />
                        Total Teams
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalTeams}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                            <span className="text-blue-600 dark:text-blue-400">All registered</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Organized response units
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-green-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconUserCheck className="size-4 text-green-500" />
                        Active Teams
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {activeTeams}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                            <span className="text-green-600 dark:text-green-400">{totalTeams > 0 ? Math.round((activeTeams / totalTeams) * 100) : 0}%</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Currently operational
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-orange-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconAlertTriangle className="size-4 text-orange-500" />
                        On-Call Teams
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {onCallTeams}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-950">
                            <span className="text-orange-600 dark:text-orange-400">{totalTeams > 0 ? Math.round((onCallTeams / totalTeams) * 100) : 0}%</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Ready for dispatch
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconChartBar className="size-4 text-purple-500" />
                        Avg Performance
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {avgPerformance}%
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950">
                            <span className="text-purple-600 dark:text-purple-400">Response rate</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Overall efficiency
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
