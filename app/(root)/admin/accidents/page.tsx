'use client'

import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { AccidentDataTable } from '@/features/admin/components/accidents/accident-data-table'
import { useGetAllAccidentsQuery } from '@/features/admin/api/adminApi';

export default function AccidentsPage() {
    const {
        data: accidents,
        isLoading: isLoadingAccidents,
        error: errorAccidents
    } = useGetAllAccidentsQuery();
    return (
        <>
            <SiteHeader title="Accident Reports" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <AccidentDataTable
                            data={accidents?.accidents || []}
                            isLoading={isLoadingAccidents}
                            error={errorAccidents}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
