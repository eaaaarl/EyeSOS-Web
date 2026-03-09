"use client"

import React, { useState } from 'react'
import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import { useAddTeamMutation } from '@/features/admin/api/adminApi'
import { TeamForm } from '@/features/admin/components/teams/team-form'
import { AddTeamPayload } from '@/features/admin/api/interface'
import { useRouter } from 'next/navigation'

export default function AddTeams() {
    const router = useRouter()
    const [addTeam] = useAddTeamMutation()
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSave = async (payload: AddTeamPayload) => {
        try {
            setSaving(true)
            const res = await addTeam({ payload }).unwrap()
            if (res.meta.success) {
                setSaved(true)
                setTimeout(() => router.push('/admin/teams'), 1800)
            }
        } catch (error) {
            console.error('Failed to save team:', error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/40">
            <SiteHeader title="Teams And Members Management" />
            <TeamForm
                mode="add"
                onSubmit={handleSave}
                isLoading={saving}
                isSaved={saved}
            />
        </div>
    )
}
