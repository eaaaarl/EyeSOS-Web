'use client'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { TeamStatsCards } from '@/features/admin/components/teams/team-stats-cards'
import { TeamDataTable } from '@/features/admin/components/teams/team-data-table'
import { useGetTeamsQuery } from '@/features/admin/api/adminApi'

function ManageTeamsPage() {
    const { data: teamsData, isLoading } = useGetTeamsQuery()

    const teams = (teamsData?.teams || []).map(t => ({
        id: t.id,
        name: t.name,
        leader: t.leader_name || 'N/A',
        membersCount: t.members_count || 0,
        status: (t.status === 'on-call' ? 'on-call' : t.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive' | 'on-call',
        performance: 100, // Default for now
        createdAt: t.created_at,
    }))

    return (
        <>
            <SiteHeader title="Teams Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <TeamStatsCards data={teams} isLoading={isLoading} />
                        <TeamDataTable data={teams} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageTeamsPage