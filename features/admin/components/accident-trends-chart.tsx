"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const chartData = [
    { date: "2024-02-08", critical: 1, high: 0, moderate: 1, minor: 0 },
    { date: "2024-02-09", critical: 0, high: 1, moderate: 0, minor: 1 },
    { date: "2024-02-10", critical: 1, high: 0, moderate: 1, minor: 0 },
    { date: "2024-02-11", critical: 0, high: 1, moderate: 0, minor: 0 },
    { date: "2024-02-12", critical: 1, high: 0, moderate: 1, minor: 0 },
    { date: "2024-02-13", critical: 1, high: 1, moderate: 0, minor: 1 },
    { date: "2024-02-14", critical: 0, high: 0, moderate: 0, minor: 0 },
]

const chartConfig = {
    critical: {
        label: "Critical",
        color: "hsl(0 84% 60%)",
    },
    high: {
        label: "High",
        color: "hsl(25 95% 53%)",
    },
    moderate: {
        label: "Moderate",
        color: "hsl(48 96% 53%)",
    },
    minor: {
        label: "Minor",
        color: "hsl(142 76% 36%)",
    },
} satisfies ChartConfig

export function AccidentTrendsChart() {
    const [timeRange, setTimeRange] = React.useState("7d")

    const filteredData = chartData

    return (
        <Card className="border-l-4 border-l-blue-500 overflow-hidden min-w-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Accident Reports Trends</CardTitle>
                    <CardDescription>
                        Showing accident reports by severity over the last 7 days
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a time range"
                    >
                        <SelectValue placeholder="Last 7 days" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="90d" className="rounded-lg">
                            Last 90 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillCritical" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-critical)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-critical)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-high)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-high)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillModerate" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-moderate)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-moderate)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMinor" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-minor)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-minor)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="minor"
                            type="monotone"
                            fill="url(#fillMinor)"
                            stroke="var(--color-minor)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <Area
                            dataKey="moderate"
                            type="monotone"
                            fill="url(#fillModerate)"
                            stroke="var(--color-moderate)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <Area
                            dataKey="high"
                            type="monotone"
                            fill="url(#fillHigh)"
                            stroke="var(--color-high)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <Area
                            dataKey="critical"
                            type="monotone"
                            fill="url(#fillCritical)"
                            stroke="var(--color-critical)"
                            strokeWidth={2}
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
