import { IconUsers, IconBuilding, IconUserPlus, IconEye } from "@tabler/icons-react"

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
import { UserProfile } from "../../api/interface";

interface UserStatsCardsProps {
    data: UserProfile[];
    isLoading?: boolean;
    isError?: boolean;
}

export function UserStatsCards({ data, isLoading }: UserStatsCardsProps) {
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

    const totalUsers = data.length;
    const lguOfficials = data.filter(user => user.user_type === 'lgu').length;
    const blguOfficials = data.filter(user => user.user_type === 'blgu').length;
    const bystanders = data.filter(user => user.user_type === 'bystander').length;

    // Calculate percentages
    const lguPercentage = totalUsers > 0 ? Math.round((lguOfficials / totalUsers) * 100) : 0;
    const blguPercentage = totalUsers > 0 ? Math.round((blguOfficials / totalUsers) * 100) : 0;
    const bystanderPercentage = totalUsers > 0 ? Math.round((bystanders / totalUsers) * 100) : 0;

    // Calculate new users this week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = data.filter(user => {
        const createdAt = new Date(user.created_at);
        return createdAt >= oneWeekAgo;
    }).length;

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card border-l-4 border-l-blue-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconUsers className="size-4 text-blue-500" />
                        Total Users
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalUsers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                            <IconUserPlus className="text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-600 dark:text-blue-400">+{newUsersThisWeek} this week</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Active registered users
                    </div>
                    <div className="text-muted-foreground">
                        Across all user types
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconBuilding className="size-4 text-purple-500" />
                        LGU Officials
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {lguOfficials}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950">
                            <span className="text-purple-600 dark:text-purple-400">{lguPercentage}%</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        City/Municipal level
                    </div>
                    <div className="text-muted-foreground">
                        Emergency coordinators
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-green-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconUsers className="size-4 text-green-500" />
                        BLGU Officials
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {blguOfficials}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                            <span className="text-green-600 dark:text-green-400">{blguPercentage}%</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Barangay level
                    </div>
                    <div className="text-muted-foreground">
                        Community responders
                    </div>
                </CardFooter>
            </Card>

            <Card className="@container/card border-l-4 border-l-cyan-500">
                <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                        <IconEye className="size-4 text-cyan-500" />
                        Bystanders
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {bystanders}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-950">
                            <span className="text-cyan-600 dark:text-cyan-400">{bystanderPercentage}%</span>
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Community reporters
                    </div>
                    <div className="text-muted-foreground">
                        Active citizens
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

