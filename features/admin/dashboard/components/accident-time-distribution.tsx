"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { AccidentReport } from "../../api/interface"
import { Skeleton } from "@/components/ui/skeleton"

export interface AccidentTimeDistributionProps {
    data?: AccidentReport[]
    isLoading?: boolean
    isError?: boolean
}

const chartConfig = {
    reports: {
        label: "Reports",
        color: "hsl(221.2 83.2% 53.3%)", // Blue
    },
} satisfies ChartConfig

export function AccidentTimeDistribution({ data, isLoading, isError }: AccidentTimeDistributionProps) {
    const timeOfDayData = React.useMemo(() => {
        if (!data) return []

        const hours = Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            display: i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`,
            reports: 0
        }))

        data.forEach((accident) => {
            const date = new Date(accident.created_at)
            const hour = date.getHours()
            hours[hour].reports++
        })

        return hours
    }, [data])

    const dayOfWeekData = React.useMemo(() => {
        if (!data) return []

        const days = [
            { day: "Sun", reports: 0, index: 0 },
            { day: "Mon", reports: 0, index: 1 },
            { day: "Tue", reports: 0, index: 2 },
            { day: "Wed", reports: 0, index: 3 },
            { day: "Thu", reports: 0, index: 4 },
            { day: "Fri", reports: 0, index: 5 },
            { day: "Sat", reports: 0, index: 6 },
        ]

        data.forEach((accident) => {
            const date = new Date(accident.created_at)
            const dayIdx = date.getDay()
            days[dayIdx].reports++
        })

        return days
    }, [data])

    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="h-[350px]">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-10 flex items-center justify-center text-center">
                    <p className="text-muted-foreground italic">Failed to load temporal distribution.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Temporal Analysis</CardTitle>
                    <CardDescription>When accidents are most likely to occur</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-2 pt-4 sm:p-6">
                <Tabs defaultValue="hour" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="hour">Time of Day</TabsTrigger>
                        <TabsTrigger value="day">Day of Week</TabsTrigger>
                    </TabsList>
                    <TabsContent value="hour">
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={timeOfDayData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="display"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    interval={3}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="reports"
                                    fill="var(--color-reports)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                    <TabsContent value="day">
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={dayOfWeekData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="day"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                />
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="reports"
                                    fill="var(--color-reports)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
