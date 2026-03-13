import { Card, CardContent } from "@/components/ui/card"

export function StatCard({ icon: Icon, label, value, sub, color = "blue" }: {
    icon: React.ElementType,
    label: string,
    value: string | number,
    sub?: string,
    color?: "blue" | "red" | "amber" | "green"
}) {
    const colorMap = {
        blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-500" },
        red: { bg: "bg-red-50", text: "text-red-600", icon: "text-red-500" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", icon: "text-amber-500" },
        green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-500" },
    }
    const c = colorMap[color]
    return (
        <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                        <p className={`text-3xl font-semibold ${c.text}`}>{value}</p>
                        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
                    </div>
                    <div className={`${c.bg} p-2.5 rounded-lg`}>
                        <Icon className={`h-5 w-5 ${c.icon}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
