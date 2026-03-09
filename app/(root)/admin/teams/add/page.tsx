"use client"

import { SiteHeader } from '@/features/admin/components/layouts/site-header'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
    id: number | string
    name: string
    role: string
    avatar: string
    email: string
    phone?: string
    isNew?: boolean
}

const EXISTING_USERS: User[] = [
    { id: 1, name: 'Alice Johnson', role: 'Paramedic', avatar: 'AJ', email: 'alice@rescue.org' },
    { id: 2, name: 'Bob Smith', role: 'Firefighter', avatar: 'BS', email: 'bob@rescue.org' },
    { id: 3, name: 'Charlie Davis', role: 'EMT', avatar: 'CD', email: 'charlie@rescue.org' },
    { id: 4, name: 'Diana Prince', role: 'Nurse', avatar: 'DP', email: 'diana@rescue.org' },
    { id: 5, name: 'Ethan Hunt', role: 'Rescue Specialist', avatar: 'EH', email: 'ethan@rescue.org' },
]

const ROLES = ['Paramedic', 'Firefighter', 'EMT', 'Nurse', 'Rescue Specialist', 'Commander', 'Logistics', 'Coordinator']

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avatarColors = [
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
    'bg-amber-100 text-amber-700',
    'bg-fuchsia-100 text-fuchsia-700',
]
function avatarColor(initials = '') {
    return avatarColors[initials.charCodeAt(0) % avatarColors.length]
}

function CustomAvatar({ initials = '?', size = 'default' }: { initials?: string; size?: 'sm' | 'default' | 'lg' }) {
    return (
        <Avatar size={size}>
            <AvatarFallback className={cn('font-bold', avatarColor(initials))}>
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
}

// ─── New User inline form ─────────────────────────────────────────────────────
function NewUserForm({ onAdd, onCancel }: { onAdd: (u: User) => void; onCancel: () => void }) {
    const [form, setForm] = useState({ name: '', email: '', role: '', phone: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

    const submit = () => {
        const e: Record<string, string> = {}
        if (!form.name.trim()) e.name = 'Name required'
        if (!form.role) e.role = 'Role required'
        if (!form.email.trim()) e.email = 'Email required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
        if (Object.keys(e).length) { setErrors(e); return }
        const initials = form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        onAdd({ id: Date.now(), name: form.name.trim(), email: form.email.trim(), role: form.role, phone: form.phone, avatar: initials, isNew: true })
    }

    return (
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 space-y-4 animate-in slide-in-from-top-1 duration-200">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
                New User Details
            </p>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name" required error={errors.name}>
                    <Input autoFocus placeholder="Jane Doe" value={form.name} onChange={e => set('name', e.target.value)}
                        className={cn("bg-white h-9 text-sm", errors.name && "border-rose-400")} />
                </Field>
                <Field label="Role" required error={errors.role}>
                    <Select value={form.role} onValueChange={v => set('role', v)}>
                        <SelectTrigger className={cn("bg-white h-9 text-sm", errors.role && "border-rose-400")}>
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Email" required error={errors.email}>
                    <Input type="email" placeholder="jane@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                        className={cn("bg-white h-9 text-sm", errors.email && "border-rose-400")} />
                </Field>
                <Field label="Phone" error={errors.phone}>
                    <Input placeholder="+1 555 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} className="bg-white h-9 text-sm" />
                </Field>
            </div>
            <div className="flex gap-2">
                <Button onClick={submit} size="sm" className="font-bold flex-1">Add User</Button>
                <Button onClick={onCancel} variant="outline" size="sm" className="font-bold flex-1">Cancel</Button>
            </div>
        </div>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AddTeams() {
    const router = useRouter()

    // Team info
    const [teamName, setTeamName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('active')
    const [teamErrors, setTeamErrors] = useState<Record<string, string>>({})

    // User pool
    const [userPool, setUserPool] = useState<User[]>([])
    const [showNewUserForm, setShowNewUserForm] = useState(false)
    const [search, setSearch] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Leader & Members
    const [leader, setLeader] = useState<User | null>(null)
    const [members, setMembers] = useState<User[]>([])
    const [assignErrors, setAssignErrors] = useState<Record<string, string>>({})

    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Close dropdown on outside click
    useEffect(() => {
        function handle(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])



    // Derived
    const notInPool = EXISTING_USERS.filter(eu => !userPool.find(u => u.id === eu.id))
    const filtered = notInPool.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    )
    const isMember = (id: number | string) => members.some(m => m.id === id)

    const setAsLeader = (u: User) => {
        if (leader?.id === u.id) {
            setLeader(null)
        } else {
            setLeader(u)
            // Remove from members if they were a member
            setMembers(prev => prev.filter(m => m.id !== u.id))
        }
        setAssignErrors(e => ({ ...e, leader: '' }))
    }

    const addToPool = (u: User) => {
        setUserPool(p => p.find(x => x.id === u.id) ? p : [...p, u])
        setSearch('')
        setShowDropdown(false)
    }

    const removeFromPool = (id: number | string) => {
        setUserPool(p => p.filter(u => u.id !== id))
        if (leader?.id === id) setLeader(null)
        setMembers(m => m.filter(u => u.id !== id))
    }

    const toggleMember = (u: User) => {
        setMembers(prev => prev.find(m => m.id === u.id) ? prev.filter(m => m.id !== u.id) : [...prev, u])
    }

    const handleSave = async () => {
        const te: Record<string, string> = {}
        const ae: Record<string, string> = {}
        if (!teamName.trim()) te.teamName = 'Team name is required'
        if (!leader) ae.leader = 'Please select a team leader'
        if (Object.keys(te).length) { setTeamErrors(te); return }
        if (Object.keys(ae).length) { setAssignErrors(ae); return }
        setSaving(true)
        await new Promise(r => setTimeout(r, 1200))
        setSaving(false)
        setSaved(true)
        setTimeout(() => router.push('/admin/teams'), 1800)
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/40">
            <SiteHeader title="Teams And Members Management" />

            <div className="flex-1 w-full space-y-6 p-6 md:p-8">

                {/* ── Top bar ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Team</h1>
                        <p className="text-sm text-slate-400 mt-0.5">Configure your team profile and assign members from your pool.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => router.back()} className="font-bold border-slate-200">
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setTeamName(''); setDescription(''); setStatus('active')
                                setTeamErrors({}); setAssignErrors({})
                                setUserPool([]); setLeader(null); setMembers([])
                                setSearch(''); setShowDropdown(false); setShowNewUserForm(false)
                                setSaving(false); setSaved(false)
                            }}
                            className="font-bold border-slate-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset
                        </Button>
                        <Button onClick={handleSave} disabled={saving || saved} className="font-bold px-7 shadow-sm">
                            {saving ? (
                                <><svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Saving…</>
                            ) : saved ? (
                                <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Saved!</>
                            ) : 'Create Team'}
                        </Button>
                    </div>
                </div>

                {/* ── Success banner ── */}
                {saved && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3.5 text-sm font-medium animate-in fade-in slide-in-from-top-3 duration-300">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p>Team <strong>{teamName}</strong> created! Redirecting…</p>
                    </div>
                )}

                {/* ── 2-Column Grid ── */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                    {/* ════════════════════════════
                        LEFT — Add Users (larger)
                    ════════════════════════════ */}
                    <div className="xl:col-span-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Add Users</p>
                                        <p className="text-xs text-slate-400">Configure your team, search and add users, then assign roles</p>
                                    </div>
                                </div>
                                {userPool.length > 0 && (
                                    <span className="text-xs font-bold bg-slate-800 text-white rounded-full px-2.5 py-1">{userPool.length} added</span>
                                )}
                            </div>

                            <div className="px-6 py-5 space-y-5">

                                {/* ── Search & add users ── */}
                                <div className="flex gap-3">
                                    <div className="relative flex-1" ref={dropdownRef}>
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <Input
                                            className="pl-9 bg-white"
                                            placeholder="Search users by name or role…"
                                            value={search}
                                            onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
                                            onFocus={() => setShowDropdown(true)}
                                        />
                                        {search && (
                                            <button onClick={() => { setSearch(''); setShowDropdown(false) }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Dropdown */}
                                        {showDropdown && (
                                            <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100">
                                                {filtered.length === 0 ? (
                                                    <div className="px-5 py-6 text-center">
                                                        <p className="text-sm text-slate-500 font-medium">No users found.</p>
                                                        <button onClick={() => { setShowNewUserForm(true); setShowDropdown(false) }}
                                                            className="text-xs font-bold text-slate-700 underline mt-1">Create a new user?</button>
                                                    </div>
                                                ) : (
                                                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                                                        {filtered.map(u => (
                                                            <button key={u.id} onClick={() => addToPool(u)}
                                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left group transition-colors">
                                                                <CustomAvatar initials={u.avatar} size="sm" />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                                                                    <p className="text-xs text-slate-400">{u.role}</p>
                                                                </div>
                                                                <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity pr-1">+ Add</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 flex justify-between items-center">
                                                    <button onClick={() => { setShowNewUserForm(true); setShowDropdown(false) }}
                                                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                                        New User
                                                    </button>
                                                    <button onClick={() => setShowDropdown(false)} className="text-xs text-slate-400 hover:text-slate-600 font-medium">Close</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        variant={showNewUserForm ? "default" : "outline"}
                                        onClick={() => { setShowNewUserForm(v => !v); setShowDropdown(false) }}
                                        className="font-bold border-slate-200 flex-shrink-0"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Add New User
                                    </Button>
                                </div>

                                {/* New user form */}
                                {showNewUserForm && (
                                    <NewUserForm
                                        onAdd={u => { addToPool(u); setShowNewUserForm(false) }}
                                        onCancel={() => setShowNewUserForm(false)}
                                    />
                                )}

                                <div className="border-t border-slate-100" />

                                {/* ── Team details fields (vertical, compact) ── */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Field label="Team Name" required error={teamErrors.teamName}>
                                            <Input
                                                className={cn("bg-white h-9", teamErrors.teamName && "border-rose-400 focus-visible:ring-rose-400")}
                                                placeholder="e.g. Alpha Unit"
                                                value={teamName}
                                                onChange={e => { setTeamName(e.target.value); setTeamErrors(er => ({ ...er, teamName: '' })) }}
                                            />
                                        </Field>

                                        <Field label="Status">
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger className="w-full bg-white h-9 capitalize">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {['active', 'standby', 'inactive'].map(s => (
                                                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>

                                    <Field label="Description">
                                        <Textarea
                                            className="bg-white min-h-[56px] resize-none text-sm"
                                            placeholder="Team mission or area of operation…"
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                        />
                                    </Field>
                                </div>

                                {/* ── User pool with inline role assignment ── */}
                                {userPool.length > 0 ? (
                                    <>
                                        <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
                                            {userPool.map(u => {
                                                const isLeaderUser = leader?.id === u.id
                                                const isMemberUser = isMember(u.id)
                                                return (
                                                    <div key={u.id} className={cn(
                                                        "flex items-center gap-3 py-3 pr-4 transition-all duration-200 group",
                                                        isLeaderUser ? "bg-amber-50/60 pl-4" : isMemberUser ? "bg-slate-50/60 pl-10" : "bg-white hover:bg-slate-50 pl-4"
                                                    )}>
                                                        {/* Star button for leader */}
                                                        <button
                                                            onClick={() => setAsLeader(u)}
                                                            className={cn(
                                                                "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full transition-all",
                                                                isLeaderUser ? "text-amber-500" : "text-slate-300 hover:text-amber-400"
                                                            )}
                                                            title={isLeaderUser ? "Remove as leader" : "Set as leader"}
                                                        >
                                                            <svg className="w-4 h-4" fill={isLeaderUser ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        </button>

                                                        <CustomAvatar initials={u.avatar} size="sm" />

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                                                                {isLeaderUser && (
                                                                    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                                        Leader
                                                                    </span>
                                                                )}
                                                                {isMemberUser && (
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">
                                                                        Member
                                                                    </span>
                                                                )}
                                                                {u.isNew && <Badge variant="secondary" className="px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider">New</Badge>}
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                                {u.role} · {u.email}{teamName.trim() && <span className="text-slate-300"> · {teamName.trim()}</span>}
                                                            </p>
                                                        </div>

                                                        {/* Member checkbox (only if not the leader) */}
                                                        {!isLeaderUser && (
                                                            <button
                                                                onClick={() => toggleMember(u)}
                                                                className={cn(
                                                                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                                                    isMemberUser ? "border-sky-500 bg-sky-500" : "border-slate-200 bg-white hover:border-slate-300"
                                                                )}
                                                                title={isMemberUser ? "Remove from team" : "Add as member"}
                                                            >
                                                                {isMemberUser && (
                                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        )}

                                                        {/* Remove button */}
                                                        <button onClick={() => removeFromPool(u.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 flex-shrink-0">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <p className="text-[10px] text-slate-400">
                                            Click ⭐ to set leader · Check ☑ to add members
                                        </p>
                                    </>
                                ) : !showNewUserForm && (
                                    <div className="border-2 border-dashed border-slate-100 rounded-xl py-10 text-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-500">No users added yet</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Search above or create a new user to get started</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════
                        RIGHT — Team Info Preview (smaller, sticky)
                    ════════════════════════════ */}
                    <div className="xl:col-span-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                                <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Team Information</p>
                                        <p className="text-xs text-slate-400">Live preview</p>
                                    </div>
                                </div>
                                {(leader || members.length > 0) && (
                                    <span className="text-xs font-bold bg-slate-800 text-white rounded-full px-2.5 py-1">
                                        {(leader ? 1 : 0) + members.length}
                                    </span>
                                )}
                            </div>

                            <div className="px-5 py-5">
                                {/* Team name + status + description */}
                                {teamName.trim() ? (
                                    <div className="mb-4">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight">{teamName.trim()}</h3>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                status === 'active' ? "bg-emerald-100 text-emerald-700"
                                                    : status === 'standby' ? "bg-amber-100 text-amber-700"
                                                        : "bg-slate-100 text-slate-500"
                                            )}>{status}</span>
                                            {description.trim() && (
                                                <p className="text-[11px] text-slate-400 leading-tight">{description.trim()}</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-300 italic">Team name not set</p>
                                    </div>
                                )}

                                {/* Roster — leader & members */}
                                {(leader || members.length > 0) ? (
                                    <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
                                        {/* Leader row — not indented */}
                                        {leader && (
                                            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50/60">
                                                <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <CustomAvatar initials={leader.avatar} size="sm" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-bold text-slate-800 truncate">{leader.name}</p>
                                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Leader</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">{leader.role}{teamName.trim() && <span className="text-slate-300"> · {teamName.trim()}</span>}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Member rows — indented */}
                                        {members.map(m => (
                                            <div key={m.id} className="flex items-center gap-2.5 pl-12 pr-3 py-2.5 bg-slate-50/40">
                                                <CustomAvatar initials={m.avatar} size="sm" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-semibold text-slate-700 truncate">{m.name}</p>
                                                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-700">Member</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400">{m.role}{teamName.trim() && <span className="text-slate-300"> · {teamName.trim()}</span>}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-100 rounded-xl py-6 text-center">
                                        <p className="text-xs text-slate-400 font-medium">No members assigned</p>
                                        <p className="text-[10px] text-slate-300 mt-0.5">Assign roles on the left</p>
                                    </div>
                                )}

                                {assignErrors.leader && (
                                    <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1.5 mt-3">
                                        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {assignErrors.leader}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}