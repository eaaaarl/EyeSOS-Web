import { TooltipProps } from "recharts"

export const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-100 rounded-lg shadow-lg px-3 py-2 text-xs">
            {label && <p className="font-medium text-gray-700 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color ?? p.fill }}>
                    {p.name ?? p.dataKey}: <span className="font-semibold">{p.value}</span>
                </p>
            ))}
        </div>
    )
}
