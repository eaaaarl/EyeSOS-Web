'use client'
import * as React from "react"
const SiteHeader = React.lazy(() => import("@/features/admin/components/layouts/site-header").then(module => ({ default: module.SiteHeader })))
import { AccidentStatsCards } from "@/features/admin/dashboard/components/accident-stats-cards"
import { AccidentStatusDonut } from "@/features/admin/dashboard/components/accident-status-donut"
import { AccidentTimeDistribution } from "@/features/admin/dashboard/components/accident-time-distribution"
import { useGetAllAccidentsQuery } from "@/features/admin/api/adminApi"
import { AccidentTrendsChart } from "@/features/admin/dashboard/components/accident-trends-chart"

export default function AdminPage() {
    const {
        data: accidents,
        isLoading,
        isError,
    } = useGetAllAccidentsQuery()

    const countTotalReports = accidents?.accidents.length || 0
    const countResolveReports = accidents?.accidents.filter((accident) => accident.accident_status === "RESOLVED").length || 0
    const activeReports = accidents?.accidents.filter((accident) => accident.accident_status === "NEW").length || 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const resolvedToday = accidents?.accidents.filter((accident) => {
        if (accident.accident_status !== "RESOLVED") return false
        const updatedAt = new Date(accident.updated_at)
        return updatedAt >= today
    }).length || 0

    const accidentsWithResponse = accidents?.accidents.filter(a => a.accident_responses && a.accident_responses.length > 0) || []
    const totalResponseTimeMinutes = accidentsWithResponse.reduce((acc, accident) => {
        const response = accident.accident_responses.find(r => r.response_type === "accepted" || r.response_type === "arrived")
        if (response && response.responded_at) {
            const startTime = new Date(accident.created_at).getTime()
            const endTime = new Date(response.responded_at).getTime()
            return acc + (endTime - startTime) / (1000 * 60)
        }
        return acc
    }, 0)

    const avgResponseTime = accidentsWithResponse.length > 0
        ? totalResponseTimeMinutes / accidentsWithResponse.length
        : 0

    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AccidentStatsCards
                            countTotalReport={countTotalReports}
                            countResolvedReport={countResolveReports}
                            countActiveReport={activeReports}
                            countResolvedToday={resolvedToday}
                            countAvgResponseTime={avgResponseTime}
                            isError={isError}
                            isLoading={isLoading}
                        />

                        <div className="px-4 lg:px-6">
                            <AccidentTrendsChart
                                data={accidents?.accidents}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2">
                            <AccidentStatusDonut
                                data={accidents?.accidents}
                                isLoading={isLoading}
                                isError={isError}
                            />
                            <AccidentTimeDistribution
                                data={accidents?.accidents}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
