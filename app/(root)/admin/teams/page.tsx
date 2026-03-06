'use client'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { Team, TeamStatsCards } from '@/features/admin/components/teams/team-stats-cards'
import { TeamDataTable } from '@/features/admin/components/teams/team-data-table'

const MOCK_TEAMS: Team[] = [
    {
        id: '1',
        name: 'Alpha Response Unit',
        leader: 'John Doe',
        membersCount: 8,
        status: 'active',
        performance: 92,
        createdAt: '2024-01-15',
    },
    {
        id: '2',
        name: 'Bravo Emergency Team',
        leader: 'Jane Smith',
        membersCount: 6,
        status: 'on-call',
        performance: 88,
        createdAt: '2024-01-20',
    },
    {
        id: '3',
        name: 'Charlie Rescue Squad',
        leader: 'Robert Brown',
        membersCount: 10,
        status: 'active',
        performance: 95,
        createdAt: '2024-02-05',
    },
    {
        id: '4',
        name: 'Delta Support Group',
        leader: 'Mary White',
        membersCount: 5,
        status: 'inactive',
        performance: 75,
        createdAt: '2024-02-15',
    },
]

function ManageTeamsPage() {
    return (
        <>
            <SiteHeader title="Teams Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <TeamStatsCards data={MOCK_TEAMS} />
                        <TeamDataTable data={MOCK_TEAMS} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageTeamsPage