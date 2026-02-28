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
import { AccidentReport } from "../../api/interface"
import { Skeleton } from "@/components/ui/skeleton"

export interface AccidentHotspotsChartProps {
    data?: AccidentReport[]
    isLoading?: boolean
    isError?: boolean
}

const chartConfig = {
    reports: {
        label: "Reports",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function AccidentHotspotsChart({ data, isLoading, isError }: AccidentHotspotsChartProps) {
    const chartData = React.useMemo(() => {
        if (!data) return []

        const counts: Record<string, number> = {}

        data.forEach((accident) => {
            const loc = accident.barangay || accident.municipality || "Unknown"
            counts[loc] = (counts[loc] || 0) + 1
        })

        return Object.entries(counts)
            .map(([location, reports]) => ({ location, reports }))
            .sort((a, b) => b.reports - a.reports)
            .slice(0, 10) // Top 10 hotspots
    }, [data])

    if (isLoading) {
        return (
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="h-[300px]">
                    <Skeleton className="h-full w-full" />
                </CardContent>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="border-l-4 border-l-destructive">
                <CardContent className="p-10 flex items-center justify-center text-center">
                    <p className="text-muted-foreground italic">Failed to load hotspot data.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
                <CardTitle>Location Hotspots</CardTitle>
                <CardDescription>Top 10 areas with most reported accidents</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                            right: 40
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="location"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            hide
                        />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="reports"
                            fill="var(--color-reports)"
                            layout="vertical"
                            radius={5}
                            label={{
                                position: 'right',
                                fill: 'var(--foreground)',
                                fontSize: 12,
                                formatter: (val: number, entry: { location: string }) => `${entry?.location}: ${val}`
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
