
import accidentData from "./accidents-data.json"
import { SiteHeader } from "@/features/admin/components/layouts/site-header"
import { AccidentStatsCards } from "@/features/admin/components/accident-stats-cards"
import { AccidentTrendsChart } from "@/features/admin/components/accident-trends-chart"
import { AccidentDataTable } from "@/features/admin/components/accident-data-table"

export default function AdminPage() {
    return (
        <>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AccidentStatsCards />
                        <div className="px-4 lg:px-6">
                            <AccidentTrendsChart />
                        </div>
                        <AccidentDataTable data={accidentData} />
                    </div>
                </div>
            </div>
        </>
    )
}
