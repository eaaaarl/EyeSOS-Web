import * as React from "react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, PieChart, Pie } from "recharts"
import { ChartCard } from "./chart-card"
import { CustomTooltip } from "./custom-tooltip"
import { COLORS, barangayData, lightingData, roadTypeData } from "../constants"

export function HotspotsTab() {
    return (
        <div className="space-y-4">
            <ChartCard title="Incidents per Barangay" description="Payasan and Poblacion are the top hotspots">
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barangayData} layout="vertical" margin={{ top: 4, right: 40, left: 70, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="incidents" radius={[0, 4, 4, 0]}>
                            {barangayData.map((d, i) => (
                                <Cell key={i} fill={d.incidents >= 80 ? COLORS.red : d.incidents >= 50 ? COLORS.amber : COLORS.blue} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChartCard title="Lighting Conditions" description="58% of accidents happen in daylight">
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={lightingData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" paddingAngle={2}>
                                {lightingData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                        {lightingData.map(d => (
                            <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                                {d.name} ({d.value})
                            </div>
                        ))}
                    </div>
                </ChartCard>

                <ChartCard title="Road Type" description="Barangay roads account for 73% of incidents">
                    <div className="space-y-2.5 mt-1">
                        {roadTypeData.map((d, i) => {
                            const pct = Math.round(d.value / 606 * 100)
                            const colors = [COLORS.blue, COLORS.rose, COLORS.amber, COLORS.teal, COLORS.purple]
                            return (
                                <div key={d.name}>
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span className="text-muted-foreground">{d.name}</span>
                                        <span className="font-medium">{d.value} <span className="text-muted-foreground">({pct}%)</span></span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: colors[i] }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ChartCard>
            </div>
        </div>
    )
}
