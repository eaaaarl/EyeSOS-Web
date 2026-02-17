'use client'
import { SiteHeader } from "@/features/admin/components/layouts/site-header"
import { AccidentStatsCards } from "@/features/admin/components/accidents/accident-stats-cards"
import { AccidentTrendsChart } from "@/features/admin/components/accidents/accident-trends-chart"
import { useGetAllAccidentsQuery } from "@/features/admin/api/adminApi"

export default function AdminPage() {

    const {
        data: accidents,
        isLoading,
        isError,
    } = useGetAllAccidentsQuery()


    const countTotalReports = accidents?.accidents.length || 0
    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AccidentStatsCards
                            countTotalReport={countTotalReports}
                            isError={isError}
                            isLoading={isLoading}
                        />
                        <div className="px-4 lg:px-6">
                            <AccidentTrendsChart />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
