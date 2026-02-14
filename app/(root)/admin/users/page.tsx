'use client'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { UserStatsCards } from '@/features/admin/components/user-stats-cards'
import { UserDataTable } from '@/features/admin/components/user-data-table'
import { useGetAllUsersQuery } from '@/features/admin/api/adminApi'

export default function UsersPage() {
    const { data: userData, isLoading: isLoadingUsers, error: usersError } = useGetAllUsersQuery()
    return (
        <>
            <SiteHeader title="Users Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <UserStatsCards data={userData?.users ?? []} />
                        <UserDataTable
                            data={userData?.users ?? []}
                            isLoading={isLoadingUsers}
                            error={usersError}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

