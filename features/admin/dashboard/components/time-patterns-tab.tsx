import * as React from "react"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, BarChart, Bar, Cell } from "recharts"
import { Sunrise, Sun, Moon, SunDim } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ChartCard } from "./chart-card"
import { CustomTooltip } from "./custom-tooltip"
import { COLORS } from "../constants"

interface TimePatternsTabProps {
    todData: { name: string; value: number; color: string }[];
    totalAccidents: number;
    hourData: { hour: string; incidents: number }[];
    monthData: { month: string; incidents: number }[];
    dowData: { day: string; incidents: number }[];
}

export function TimePatternsTab({
    todData,
    totalAccidents,
    hourData,
    monthData,
    dowData,
}: TimePatternsTabProps) {
    const todIcons: Record<string, React.ElementType> = {
        Morning: Sunrise,
        Afternoon: Sun,
        Evening: SunDim,
        Night: Moon,
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {todData.map(d => {
                    const Icon = todIcons[d.name]
                    return (
                        <Card key={d.name} className="border-0 shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className="h-4 w-4" style={{ color: d.color }} />
                                    <span className="text-xs font-medium text-muted-foreground">{d.name}</span>
                                </div>
                                <p className="text-2xl font-semibold" style={{ color: d.color }}>{d.value}</p>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(d.value / totalAccidents * 100)}% of incidents
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <ChartCard title="Incidents by Hour of Day" description="Peak risk window: 4 PM – 7 PM">
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={hourData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.rose} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={COLORS.rose} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={1} angle={-35} textAnchor="end" height={40} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="incidents" stroke={COLORS.rose} strokeWidth={2} fill="url(#hourGrad)" dot={{ r: 2, fill: COLORS.rose }} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChartCard title="Incidents by Month" description="June peaks — possible rainy season correlation">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={monthData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="incidents" radius={[3, 3, 0, 0]}>
                                {monthData.map((d, i) => (
                                    <Cell key={i} fill={d.incidents === 70 ? COLORS.rose : COLORS.blue} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Incidents by Day of Week" description="Sunday has the most incidents by far">
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={dowData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="incidents" radius={[3, 3, 0, 0]}>
                                {dowData.map((d, i) => {
                                    const maxDay = dowData.reduce((a, b) => a.incidents > b.incidents ? a : b).day;
                                    return <Cell key={i} fill={d.day === maxDay ? COLORS.rose : COLORS.blue} />
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    )
}
