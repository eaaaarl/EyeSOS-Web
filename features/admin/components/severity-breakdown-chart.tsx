"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "Critical", value: 4, color: "hsl(0 84% 60%)" },
    { name: "High", value: 3, color: "hsl(25 95% 53%)" },
    { name: "Moderate", value: 3, color: "hsl(48 96% 53%)" },
    { name: "Minor", value: 2, color: "hsl(142 76% 36%)" },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            className="font-bold text-sm"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export function SeverityBreakdownChart() {
    return (
        <Card className="mx-4 lg:mx-6">
            <CardHeader>
                <CardTitle>Severity Breakdown</CardTitle>
                <CardDescription>
                    Distribution of incidents by severity level
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">4</div>
                        <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
                        <div className="text-xs text-muted-foreground">High</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</div>
                        <div className="text-xs text-muted-foreground">Moderate</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">2</div>
                        <div className="text-xs text-muted-foreground">Minor</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
