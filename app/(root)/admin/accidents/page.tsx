'use client'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { AccidentDataTable } from '@/features/admin/components/accident-data-table'
import accidentData from '@/constant/accidents-data.json'

export default function AccidentsPage() {
    return (
        <>
            <SiteHeader title="Accident Reports" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AccidentDataTable data={accidentData} />
                    </div>
                </div>
            </div>
        </>
    )
}
