import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ChartCard({ title, description, children, className = "" }: {
    title: string,
    description?: string,
    children: React.ReactNode,
    className?: string
}) {
    return (
        <Card className={`border-0 shadow-sm ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {description && <CardDescription className="text-xs">{description}</CardDescription>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}
