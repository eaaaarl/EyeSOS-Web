"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetTeamDetailsQuery } from "@/features/admin/api/adminApi"
import { Loader2, Users, Shield, Calendar, Phone, Mail, MapPin, Activity, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamDetailsModalProps {
    teamId: string | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function TeamDetailsModal({ teamId, isOpen, onOpenChange }: TeamDetailsModalProps) {
    const { data: details, isLoading, error } = useGetTeamDetailsQuery(teamId || "", {
        skip: !teamId || !isOpen,
    })

    if (!teamId) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-0 overflow-hidden border border-slate-200 bg-white shadow-lg">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-semibold tracking-wide uppercase border-primary/20 bg-primary/5 text-primary px-2 py-0.5">
                                Unit Profile
                            </Badge>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-500">
                                <Info className="size-3" />
                                ID: {teamId.slice(0, 8)}
                            </div>
                        </div>
                        {!isLoading && details?.team.status && (
                            <Badge className={cn(
                                "capitalize font-semibold px-3 py-1 rounded-full text-xs mr-4",
                                details.team.status === 'active' ? 'bg-emerald-500 text-white' :
                                    details.team.status === 'on-call' ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'
                            )}>
                                <Activity className="size-3 mr-1 inline" />
                                {details.team.status}
                            </Badge>
                        )}
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">
                        {isLoading ? <div className="h-7 w-48 bg-slate-200 animate-pulse rounded-md" /> : details?.team.name}
                    </DialogTitle>
                    <DialogDescription asChild className="text-sm text-slate-500 mt-1">
                        <div>
                            {isLoading
                                ? <div className="h-4 w-64 bg-slate-200 animate-pulse rounded-md mt-1" />
                                : details?.team.description || "Active emergency response unit."
                            }
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm text-slate-500">Loading team details...</p>
                    </div>
                ) : error ? (
                    <div className="h-64 flex flex-col items-center justify-center p-8 text-center gap-3">
                        <div className="size-12 rounded-full bg-red-50 flex items-center justify-center text-red-400 border border-red-100">
                            <Shield className="size-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Could not load team</p>
                            <p className="text-sm text-slate-400 mt-1">The team data could not be retrieved.</p>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Unit meta row */}
                        <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/50">
                            <div className="px-6 py-4 flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                    <Shield className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Unit Leader</p>
                                    <p className="text-sm font-semibold text-slate-800 leading-tight mt-0.5">
                                        {details?.team.leader_name || "Unassigned"}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 py-4 flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                    <Calendar className="size-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Commission Date</p>
                                    <p className="text-sm font-semibold text-slate-800 leading-tight mt-0.5">
                                        {new Date(details?.team.created_at || "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Personnel roster */}
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="size-4 text-slate-500" />
                                <h3 className="text-sm font-semibold text-slate-800">Personnel Roster</h3>
                                <span className="text-xs text-slate-400 ml-1">— {details?.members.length} assigned</span>
                            </div>

                            <ScrollArea className="h-[260px]">
                                <div className="space-y-2 pr-2">
                                    {details?.members.map((member) => (
                                        <div
                                            key={member.id}
                                            className="group flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                                        >
                                            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-base border border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors shrink-0">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                                                    <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wide text-slate-400 border-slate-200 shrink-0">
                                                        {member.user_type}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Mail className="size-3" />
                                                        {member.email}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Phone className="size-3" />
                                                        {member.mobileNo || "No contact"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {details?.members.length === 0 && (
                                        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                                            <Users className="size-5 text-slate-300 mb-2" />
                                            <p className="text-sm text-slate-400">No personnel assigned</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}