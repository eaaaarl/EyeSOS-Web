"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setClearUserSession } from "@/lib/redux/state/authSlice";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Phone, ShieldCheck, Activity, MapPin, LayoutDashboard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllAccidentsQuery } from "../../api/adminApi";

interface AdminProfileSheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminProfileSheet({ isOpen, onOpenChange }: AdminProfileSheetProps) {
    const isMobile = useIsMobile();
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: profileData, isLoading: profileLoading } = useGetUserProfileQuery(
        { user_id: user?.id || "" },
        { skip: !user?.id }
    );


    const { data: accidentsData, isLoading: accidentsLoading } = useGetAllAccidentsQuery();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await supabase.auth.signOut();
            dispatch(setClearUserSession());
            router.push("/");
            onOpenChange(false);
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleGoToDashboard = () => {
        router.push("/admin");
        onOpenChange(false);
    };

    const profile = profileData?.profile;
    const userEmail = user?.email || profile?.email || "N/A";
    const userName = profile?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";
    const userPhone = profile?.mobileNo || "N/A";
    const userInitials = userName.split(" ").map((n: string) => n?.[0] || "").join("").toUpperCase().slice(0, 2);
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "N/A";

    const mapStats = [
        { label: "Active Incidents", value: accidentsData?.accidents?.filter((accident) => accident.accident_status === "NEW").length, icon: MapPin, color: "text-red-500", bg: "bg-red-50", iconBg: "bg-red-100" },
        { label: "All Reports", value: accidentsData?.accidents?.length, icon: Activity, color: "text-amber-500", bg: "bg-amber-50", iconBg: "bg-amber-100" },
    ];

    const ProfileInfo = () => (
        <>
            <div className="relative shrink-0" aria-label="Profile header">
                <div className="h-24 bg-linear-to-br from-orange-500 to-amber-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md" aria-hidden="true">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold tracking-wider text-sm" role="status">ADMINISTRATOR</span>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 -bottom-12">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-2xl">
                            {profileLoading ? (
                                <Skeleton className="w-full h-full rounded-full" />
                            ) : profile?.avatarUrl ? (
                                <Image
                                    src={profile.avatarUrl}
                                    alt={userName}
                                    width={96}
                                    height={96}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold" aria-label={`User initials: ${userInitials}`}>
                                    {userInitials}
                                </div>
                            )}
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg"
                            title="System Active"
                            aria-label="System status: Active"
                        >
                            <Activity className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto  pt-14 px-4 pb-4">
                {profileLoading ? (
                    <div className="text-center space-y-1 mb-8">
                        <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
                        <Skeleton className="h-4 w-32 mx-auto rounded" />
                    </div>
                ) : (
                    <div className="text-center space-y-1 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{userName}</h2>
                        <p className="text-sm font-medium text-gray-500">
                            System Controller • Since {memberSince}
                        </p>
                    </div>
                )}

                {profileLoading ? (
                    <div className="space-y-6">
                        {/* Map Stats Skeleton */}
                        <div className="rounded-2xl p-4 border border-gray-100 shadow-sm bg-white">
                            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-3 w-24 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-12 rounded" />
                                            <Skeleton className="h-3 w-16 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Contact Info Skeleton */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-3 w-32 rounded" />
                            </div>
                            <div className="grid gap-3">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-10 h-10 rounded-lg" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-3 w-24 rounded" />
                                                <Skeleton className="h-4 w-40 rounded" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Actions Skeleton */}
                        <div className="pt-2 space-y-3">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Map Stats */}
                        <div className="rounded-2xl p-4 border border-gray-100 shadow-sm bg-white" role="region" aria-label="Map statistics">
                            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                <MapPin className="w-4 h-4 text-orange-500" aria-hidden="true" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Map Overview
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3" role="list">
                                {mapStats.map(({ label, value, icon: Icon, color, bg, iconBg }, i) => (
                                    <div
                                        key={i}
                                        className={`${bg} rounded-xl p-3 flex items-center gap-3 transition-transform hover:scale-[1.02] duration-200`}
                                        role="listitem"
                                    >
                                        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
                                            <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${color}`}>{label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Contact Info */}
                        <div className="space-y-3" role="region" aria-labelledby="contact-info-heading">
                            <h3 id="contact-info-heading" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <User className="w-4 h-4 text-orange-500" aria-hidden="true" />
                                Secure Credentials
                            </h3>

                            <div className="grid gap-3">
                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200 group cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-200" aria-hidden="true">
                                            <Mail className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Primary Access Email</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">{userEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200 group cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-200" aria-hidden="true">
                                            <Phone className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Emergency Contact</p>
                                            <p className="text-sm font-semibold text-gray-900">{userPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 space-y-3" role="group" aria-label="Profile actions">
                            <Button
                                onClick={handleGoToDashboard}
                                variant="outline"
                                className="w-full h-10 rounded-xl border-2 border-orange-100 font-bold text-orange-600 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                                aria-label="Navigate to admin dashboard"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" aria-hidden="true" />
                                Go to Dashboard
                            </Button>

                            <Button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full h-10 rounded-xl bg-linear-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-200 hover:shadow-xl font-bold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                aria-label="Log out of your account"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
                                        <span>Logging Out...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                                        Logout
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    if (!mounted) return null;

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="h-[85vh] rounded-t-xl bg-white border-none border-t-0 flex flex-col p-0 overflow-hidden outline-none [&>div:first-child]:hidden">
                    <DrawerTitle className="sr-only">Admin Profile</DrawerTitle>
                    <div className="mx-auto mt-4 h-1.5 w-16 shrink-0 rounded-full bg-gray-200 mb-2" />
                    <ProfileInfo />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
                <SheetTitle className="sr-only">Admin Profile</SheetTitle>
                <ProfileInfo />
            </SheetContent>
        </Sheet>
    );
}