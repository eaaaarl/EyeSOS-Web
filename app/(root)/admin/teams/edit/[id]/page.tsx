"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { useGetTeamDetailsQuery, useUpdateTeamMutation } from '@/features/admin/api/adminApi'
import { TeamForm } from '@/features/admin/components/teams/team-form'
import { AddTeamPayload } from '@/features/admin/api/interface'
import { Loader2 } from 'lucide-react'

export default function EditTeamPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string

    const { data, isLoading: isFetching } = useGetTeamDetailsQuery(id)
    const [updateTeam] = useUpdateTeamMutation()

    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async (payload: AddTeamPayload) => {
        try {
            setSaving(true)
            const res = await updateTeam({ id, payload }).unwrap()
            if (res.meta.success) {
                setSaved(true)
                setTimeout(() => router.push('/admin/teams'), 1800)
            }
        } catch (error) {
            console.error('Failed to update team:', error)
        } finally {
            setSaving(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50/40">
                <SiteHeader title="Teams And Members Management" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
                        <p className="text-sm font-medium text-slate-400">Loading team details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!data?.team) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50/40">
                <SiteHeader title="Teams And Members Management" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-slate-800">Team not found</h2>
                        <p className="text-slate-500 mt-2">The team you are looking for does not exist or has been deleted.</p>
                        <button
                            onClick={() => router.push('/admin/teams')}
                            className="mt-6 text-sm font-bold text-primary hover:underline"
                        >
                            &larr; Back to Teams
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/40">
            <SiteHeader title="Teams And Members Management" />
            <TeamForm
                mode="edit"
                initialData={{
                    name: data.team.name,
                    description: data.team.description || '',
                    status: data.team.status,
                    leader: data.team.leader || null,
                    members: data.members.filter(m => m.id !== data.team.leader_id)
                }}
                onSubmit={handleSave}
                isLoading={saving}
                isSaved={saved}
            />
        </div>
    )
}
