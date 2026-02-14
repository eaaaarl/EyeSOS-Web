import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { UserStatsCards } from '@/features/admin/components/user-stats-cards'
import { UserDataTable } from '@/features/admin/components/user-data-table'
import usersDataRaw from '@/constant/users-data.json'

type UserProfile = {
    id: string
    name: string
    email: string
    mobileNo: string
    avatarUrl: string
    user_type: "bystander" | "blgu" | "lgu" | "admin"
    created_at?: string
    updated_at?: string
    organizations_id?: string | null
    emergency_contact_name?: string
    emergency_contact_number?: string
    birthdate?: string
    bio?: string
    permanent_address: string
}

const usersData = usersDataRaw as UserProfile[]


export default function UsersPage() {
    return (
        <>
            <SiteHeader title="Users Management" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <UserStatsCards />
                        <UserDataTable data={usersData} />
                    </div>
                </div>
            </div>
        </>
    )
}

