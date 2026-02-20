"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { municipality: "Quezon City", incidents: 3, critical: 1, high: 1, moderate: 0, minor: 1 },
    { municipality: "Makati", incidents: 2, critical: 0, high: 1, moderate: 0, minor: 1 },
    { municipality: "Pasig", incidents: 2, critical: 0, high: 0, moderate: 1, minor: 1 },
    { municipality: "Manila", incidents: 2, critical: 1, high: 0, moderate: 1, minor: 0 },
    { municipality: "Mandaluyong", incidents: 1, critical: 0, high: 0, moderate: 1, minor: 0 },
    { municipality: "Muntinlupa", incidents: 1, critical: 1, high: 0, moderate: 0, minor: 0 },
    { municipality: "Taguig", incidents: 1, critical: 0, high: 1, moderate: 0, minor: 0 },
]

export function GeographicDistributionChart() {
    return (
        <Card className="mx-4 lg:mx-6">
            <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>
                    Incident reports by municipality and severity level
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="municipality"
                            className="text-xs"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis className="text-xs" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="critical"
                            stackId="a"
                            fill="hsl(0 84% 60%)"
                            name="Critical"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="high"
                            stackId="a"
                            fill="hsl(25 95% 53%)"
                            name="High"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="moderate"
                            stackId="a"
                            fill="hsl(48 96% 53%)"
                            name="Moderate"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="minor"
                            stackId="a"
                            fill="hsl(142 76% 36%)"
                            name="Minor"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
