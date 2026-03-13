import * as React from "react"
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell } from "recharts"
import { Shield, Users, MapPin, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "./stat-card"
import { CustomTooltip } from "./custom-tooltip"
import { COLORS, teamData } from "../constants"

export function TeamsOverviewTab() {
    const [selected, setSelected] = React.useState(1)
    const team = teamData.find(t => t.id === selected)

    return (
        <div className="space-y-4">
            {/* Summary strip */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <StatCard icon={Shield} label="Combined Responses" value="311" sub="Team 1 + 2 + 3" color="blue" />
                <StatCard icon={Users} label="Unassigned Records" value="238" sub="No responder logged" color="amber" />
                <StatCard icon={MapPin} label="Top Barangay" value="Payasan" sub="Most responded to" color="green" />
                <StatCard icon={TrendingUp} label="Peak Year" value="2025" sub="141 combined responses" color="blue" />
            </div>

            {/* Team selector cards */}
            <div className="grid grid-cols-3 gap-3">
                {teamData.map(t => (
                    <Card
                        key={t.id}
                        className={`border shadow-sm cursor-pointer transition-all ${selected === t.id ? "ring-2" : "opacity-70 hover:opacity-100"}`}
                        style={{ outlineColor: t.color, borderColor: selected === t.id ? t.color : undefined } as React.CSSProperties}
                        onClick={() => setSelected(t.id)}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: t.bg, color: t.textColor }}>
                                    T{t.id}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{t.name}</p>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mt-0.5">{t.badge}</Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div>
                                    <p className="text-muted-foreground">Responses</p>
                                    <p className="font-semibold text-base" style={{ color: t.color }}>{t.responses}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Collision</p>
                                    <p className="font-semibold text-base">{t.collisionRate}%</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Peak time</p>
                                    <p className="font-medium">{t.peakTime}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Peak day</p>
                                    <p className="font-medium">{t.peakDay}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detail panel */}
            {team && (
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{team.name} — detailed breakdown</CardTitle>
                        <CardDescription className="text-xs">Barangay coverage · responses by year · incident types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* Barangay bars */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-3">Top barangays responded</p>
                                <div className="space-y-2">
                                    {team.brgys.map(([name, count]) => {
                                        const max = team.brgys[0][1]
                                        return (
                                            <div key={name} className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground w-24 text-right shrink-0">{name}</span>
                                                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                    <div className="h-1.5 rounded-full" style={{ width: `${Math.round((count as number) / (max as number) * 100)}%`, background: team.color }} />
                                                </div>
                                                <span className="text-xs font-medium w-5">{count}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Year chart */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-3">Responses by year</p>
                                <ResponsiveContainer width="100%" height={120}>
                                    <BarChart data={team.years} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="r" name="Responses" fill={team.color} radius={[3, 3, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Incident type mini pie */}
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-3">Incident types handled</p>
                                <ResponsiveContainer width="100%" height={120}>
                                    <PieChart>
                                        <Pie
                                            data={[{ name: "Non-Collision", value: team.nonCollision }, { name: "Collision", value: team.collision }]}
                                            cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" paddingAngle={3}
                                        >
                                            <Cell fill={COLORS.blue} />
                                            <Cell fill={COLORS.rose} />
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <span className="w-2 h-2 rounded-sm bg-blue-500" /> Non-Collision {team.nonCollision}%
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <span className="w-2 h-2 rounded-sm bg-rose-500" /> Collision {team.collision}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Note */}
            <Card className="border border-amber-200 bg-amber-50 shadow-none">
                <CardContent className="p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800">
                        All <strong>fatal (42)</strong> and <strong>serious (37)</strong> incidents have no responder logged.
                        Consider updating MDRRMC records to assign the correct team to these cases.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
