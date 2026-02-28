"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

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

export interface AccidentStatusDonutProps {
    data?: AccidentReport[]
    isLoading?: boolean
    isError?: boolean
}

const chartConfig = {
    count: {
        label: "Reports",
    },
    NEW: {
        label: "New",
        color: "hsl(0 84% 60%)", // Red (Critical)
    },
    IN_PROGRESS: {
        label: "In Progress",
        color: "hsl(25 95% 53%)", // Orange (High)
    },
    PENDING: {
        label: "Pending",
        color: "hsl(48 96% 53%)", // Yellow (Moderate)
    },
    RESOLVED: {
        label: "Resolved",
        color: "hsl(142 76% 36%)", // Green (Minor)
    },
    VERIFIED: {
        label: "Verified",
        color: "hsl(217 91% 60%)", // Blue
    }
} satisfies ChartConfig

export function AccidentStatusDonut({ data, isLoading, isError }: AccidentStatusDonutProps) {
    const chartData = React.useMemo(() => {
        if (!data) return []

        const counts: Record<string, number> = {
            NEW: 0,
            IN_PROGRESS: 0,
            RESOLVED: 0,
            VERIFIED: 0,
            PENDING: 0,
        }

        data.forEach((accident) => {
            if (counts[accident.accident_status] !== undefined) {
                counts[accident.accident_status]++
            }
        })

        return [
            { status: "NEW", count: counts.NEW, fill: "var(--color-NEW)" },
            { status: "IN_PROGRESS", count: counts.IN_PROGRESS, fill: "var(--color-IN_PROGRESS)" },
            { status: "RESOLVED", count: counts.RESOLVED, fill: "var(--color-RESOLVED)" },
            { status: "VERIFIED", count: counts.VERIFIED, fill: "var(--color-VERIFIED)" },
            { status: "PENDING", count: counts.PENDING, fill: "var(--color-PENDING)" },
        ].filter(item => item.count > 0)
    }, [data])

    const totalReports = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])

    if (isLoading) {
        return (
            <Card className="flex flex-col border-l-4 border-l-blue-500">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-6 w-[150px] mb-2" />
                    <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
                        <Skeleton className="size-40 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (isError) {
        return (
            <Card className="flex flex-col border-l-4 border-l-destructive">
                <CardContent className="p-10 flex items-center justify-center text-center">
                    <p className="text-muted-foreground italic">Failed to load status distribution.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Reports by Status</CardTitle>
                    <CardDescription>Current breakdown of accident statuses</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={80}
                            outerRadius={110}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalReports.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Reports
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
