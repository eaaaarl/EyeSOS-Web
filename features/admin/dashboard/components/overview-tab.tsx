import * as React from "react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, PieChart, Pie } from "recharts"
import { Activity, AlertTriangle, Users, TrendingUp } from "lucide-react"
import { StatCard } from "./stat-card"
import { ChartCard } from "./chart-card"
import { CustomTooltip } from "./custom-tooltip"
import { COLORS } from "../constants"

interface OverviewTabProps {
    totalAccidents: number;
    subDate: string;
    totalFatalities: number;
    subFatalities: string;
    totalInjured: number;
    subInjured: string;
    collisionRate: number;
    subCollisionRate: string;
    yearData: { year: string; incidents: number }[];
    incidentTypeData: { name: string; value: number; color: string }[];
    severityData: { name: string; value: number; color: string }[];
}

export function OverviewTab({
    totalAccidents,
    subDate,
    totalFatalities,
    subFatalities,
    totalInjured,
    subInjured,
    collisionRate,
    subCollisionRate,
    yearData,
    incidentTypeData,
    severityData
}: OverviewTabProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatCard
                    icon={Activity}
                    label="Historical Incidents"
                    value={totalAccidents}
                    sub={subDate}
                    color="blue"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Fatalities"
                    value={totalFatalities}
                    sub={subFatalities}
                    color="red"
                />
                <StatCard
                    icon={Users}
                    label="Total Injured"
                    value={totalInjured}
                    sub={subInjured}
                    color="amber"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Collision Rate"
                    value={collisionRate}
                    sub={subCollisionRate}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ChartCard title="Incidents by Year" description="Upward trend — 2025 is the highest on record">
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={yearData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="incidents" radius={[4, 4, 0, 0]}>
                                {yearData.map((d, i) => (
                                    <Cell key={i} fill={d.year === "2025" ? COLORS.red : COLORS.blue} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <div className="grid grid-cols-2 gap-4">
                    <ChartCard title="Incident Type" description="Collision vs Non-collision">
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={incidentTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                                    {incidentTypeData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-1 mt-1">
                            {incidentTypeData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-sm inline-block" style={{ background: d.color }} />
                                        {d.name}
                                    </span>
                                    <span className="font-medium">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <ChartCard title="Severity" description="All 606 incidents">
                        <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={severityData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" paddingAngle={3}>
                                    {severityData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-col gap-1 mt-1">
                            {severityData.map(d => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-sm inline-block" style={{ background: d.color }} />
                                        {d.name}
                                    </span>
                                    <span className="font-medium">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>
                </div>
            </div>
        </div>
    )
}
