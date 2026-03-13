import * as React from "react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartCard } from "./chart-card"
import { CustomTooltip } from "./custom-tooltip"
import { COLORS, severityByBrgy, barangayData, severityData } from "../constants"

export function SeverityTab() {
    const fatalRisk = barangayData
        .map(b => ({ ...b, rate: Math.round(b.fatal / b.incidents * 100) }))
        .sort((a, b) => b.rate - a.rate)

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {severityData.map(d => (
                    <Card key={d.name} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-xs font-medium text-muted-foreground mb-1">{d.name}</p>
                            <p className="text-3xl font-semibold" style={{ color: d.color }}>{d.value}</p>
                            <p className="text-xs text-muted-foreground">{Math.round(d.value / 606 * 100)}% of total</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ChartCard title="Severity by Barangay" description="Stacked breakdown — Minor / Moderate / Serious / Fatal">
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={severityByBrgy} margin={{ top: 4, right: 8, left: -20, bottom: 35 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                        <Bar dataKey="Minor" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Moderate" stackId="a" fill={COLORS.amber} />
                        <Bar dataKey="Serious" stackId="a" fill={COLORS.purple} />
                        <Bar dataKey="Fatal" stackId="a" fill={COLORS.red} radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Fatality Rate by Barangay" description="Ganayon has the highest rate despite moderate total incidents">
                <div className="space-y-2">
                    {fatalRisk.filter(b => b.fatal > 0).map(b => (
                        <div key={b.name} className="flex items-center gap-3">
                            <span className="text-xs w-24 text-right text-muted-foreground shrink-0">{b.name}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                                <div className="h-2 rounded-full bg-red-500" style={{ width: `${b.rate}%` }} />
                            </div>
                            <span className="text-xs font-medium w-10">{b.rate}%</span>
                            <span className="text-xs text-muted-foreground w-16">{b.fatal} of {b.incidents}</span>
                        </div>
                    ))}
                </div>
            </ChartCard>
        </div>
    )
}
