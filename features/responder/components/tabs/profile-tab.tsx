"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setClearUserSession } from "@/lib/redux/state/authSlice";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
    LogOut, ChevronRight, Shield, Bell, HelpCircle,
    Mail, Phone, Clock, Edit, User, Siren,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const menuItems = [
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Certifications" },
    { icon: HelpCircle, label: "Help & Support" },
];

export function ProfileTab() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: profileData } = useGetUserProfileQuery(
        { user_id: user?.id || "" },
        { skip: !user?.id }
    );

    const profile = profileData?.profile;
    const userEmail = user?.email || profile?.email || "N/A";
    const userName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Responder";
    const userPhone = profile?.mobileNo || "N/A";
    const userInitials = userName.split(" ").map((n: string) => n?.[0] || "").join("").toUpperCase().slice(0, 2);
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "N/A";

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await supabase.auth.signOut();
            dispatch(setClearUserSession());
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-background">

            {/* Hero gradient banner — Sticky */}
            <div className="sticky top-0 z-20 shrink-0 shadow-sm">
                <div className="h-24 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -top-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute top-4 left-4">
                        <Siren className="w-5 h-5 text-white/80" />
                    </div>
                </div>

                {/* Avatar — Inside sticky container to maintain relative positioning or adjusted */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                            {profile?.avatarUrl ? (
                                <Image
                                    src={profile.avatarUrl}
                                    alt={userName}
                                    width={96}
                                    height={96}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-2xl font-bold">
                                    {userInitials}
                                </div>
                            )}
                        </div>
                        <button className="absolute bottom-1 right-1 w-7 h-7 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                            <Edit className="w-3.5 h-3.5 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Name + role */}
            <div className="pt-16 pb-4 px-4 text-center">
                <h2 className="text-xl font-bold text-foreground">{userName}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">First Responder since {memberSince}</p>
                <Badge className="mt-2 bg-red-600/10 text-red-600 border border-red-500/20 hover:bg-red-600/10">
                    First Responder
                </Badge>
            </div>

            <div className="px-4 space-y-4 pb-10">

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-muted/40 dark:to-muted/20 border border-border rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Siren className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-[10px] font-semibold uppercase text-red-600">Status</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">Active</p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-muted/40 dark:to-muted/20 border border-border rounded-xl p-3">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-[10px] font-semibold uppercase text-red-600">On Duty</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">Available</p>
                    </div>
                </div>

                {/* Response stats */}
                <div className="bg-gradient-to-br from-slate-50 to-zinc-50 dark:from-muted/40 dark:to-muted/20 border border-border rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-semibold text-foreground">Response History</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center">
                        <div>
                            <p className="text-xl font-bold text-foreground">0</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Total</p>
                        </div>
                        <div className="border-x border-border px-1">
                            <p className="text-xl font-bold text-foreground">0</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">This Month</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-foreground">-</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Avg. Time</p>
                        </div>
                    </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 px-1">
                        <User className="w-3.5 h-3.5" />
                        Contact Information
                    </h3>
                    <div className="bg-white dark:bg-muted/20 hover:bg-muted/30 rounded-xl p-3 border border-border transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Email Address</p>
                                <p className="text-xs font-medium text-foreground truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-muted/20 hover:bg-muted/30 rounded-xl p-3 border border-border transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-medium text-muted-foreground mb-0.5">Phone Number</p>
                                <p className="text-xs font-medium text-foreground">{userPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Menu items */}
                <div className="space-y-1">
                    {menuItems.map(({ icon: Icon, label }) => (
                        <button
                            key={label}
                            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-muted/60 transition-colors text-left"
                        >
                            <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <Icon size={18} className="text-red-600" />
                            </div>
                            <span className="flex-1 font-medium text-sm text-foreground">{label}</span>
                            <ChevronRight size={16} className="text-muted-foreground" />
                        </button>
                    ))}
                </div>

                <Separator />

                {/* Edit + Logout */}
                <div className="space-y-2 pt-1">
                    <Button
                        variant="outline"
                        className="w-full h-10 flex items-center gap-2 font-semibold text-sm"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Edit Profile
                    </Button>
                    <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full h-10 flex items-center gap-2 font-bold text-sm bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoggingOut ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogOut className="w-3.5 h-3.5" />
                                Sign Out
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div >
    );
}