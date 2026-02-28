"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, AlertTriangle, CheckCircle2, Radio, Siren } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
    useGetResponderDispatchQuery,
    useUpdateAccidentResponseStatusMutation,
    useUpdateResponderAvailabilityMutation,
} from "../../api/responderApi";
import { toast } from "sonner";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { cn } from "@/lib/utils";

interface HomeTabProps {
    onAcceptDispatch: () => void;
}

export function HomeTab({ onAcceptDispatch }: HomeTabProps) {
    const { user } = useAppSelector((state) => state.auth);

    const { data: dispatchData, refetch } = useGetResponderDispatchQuery(user?.id || "", {
        skip: !user?.id,
    });

    const { data: profileData } = useGetUserProfileQuery({ user_id: user?.id || "" }, {
        skip: !user?.id,
    });

    const [updateAccidentResponseStatus, { isLoading: isAccepting }] =
        useUpdateAccidentResponseStatusMutation();
    const [updateResponderAvailability] = useUpdateResponderAvailabilityMutation();

    const activeDispatch = dispatchData?.accident;
    const dispatchStatus = dispatchData?.status;
    const isAvailable = true;

    const handleToggleAvailability = async (val: boolean) => {
        if (!user?.id) return;
        try {
            await updateResponderAvailability({
                responderId: user.id,
                is_available: val,
            }).unwrap();
        } catch {
            toast.error("Failed to update availability.");
        }
    };

    const handleAccept = async () => {
        if (!activeDispatch || !user?.id) return;
        try {
            await updateAccidentResponseStatus({
                responderId: user.id,
                accidentId: activeDispatch.id,
                status: "accepted",
            }).unwrap();
            refetch();
            // toast.success("Dispatch accepted! Navigating to map.");
            onAcceptDispatch();
        } catch {
            toast.error("Failed to accept dispatch.");
        }
    };

    const handleDecline = async () => {
        if (!activeDispatch || !user?.id) return;
        try {
            await updateAccidentResponseStatus({
                responderId: user.id,
                accidentId: activeDispatch.id,
                status: "declined",
            }).unwrap();
            toast.info("Dispatch declined.");
        } catch {
            toast.error("Failed to decline dispatch.");
        }
    };

    const userName = profileData?.profile?.name ?? "Dashboard";

    return (
        <div className="h-full overflow-y-auto bg-background">

            {/* Hero Header — red gradient banner matching ProfileTab */}
            <div className="sticky top-0 z-20 shrink-0 shadow-sm">
                <div className="h-28 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

                    <div className="absolute inset-0 flex flex-col justify-center px-5 pt-2">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-red-200">
                            Responder
                        </p>
                        <h1 className="text-2xl font-bold text-white leading-tight mt-0.5">
                            {userName}
                        </h1>
                    </div>

                    <div className="absolute top-4 right-4">
                        <Siren className="w-5 h-5 text-white/60" />
                    </div>
                </div>

                {/* Availability toggle bar */}
                <div className="bg-background border-b border-border px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "w-2 h-2 rounded-full",
                                isAvailable ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                            )}
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                            {isAvailable ? "Available for dispatch" : "Currently offline"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {isAvailable ? "On" : "Off"}
                        </span>
                        <Switch
                            checked={isAvailable}
                            onCheckedChange={handleToggleAvailability}
                        />
                    </div>
                </div>
            </div>

            <div className="px-4 py-5 space-y-5 pb-10">

                {/* Status Banner */}
                <Card className={cn(
                    "border",
                    isAvailable
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-muted bg-muted/30"
                )}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isAvailable ? "bg-green-500/15" : "bg-muted"
                        )}>
                            <Radio size={18} className={isAvailable ? "text-green-600" : "text-muted-foreground"} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">
                                {isAvailable ? "On Duty" : "Off Duty"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {isAvailable
                                    ? "You can receive dispatch alerts"
                                    : "Toggle available to receive dispatches"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Incoming Dispatch Card */}
                {activeDispatch && dispatchStatus === "dispatched" && (
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                            Incoming Dispatch
                        </p>
                        <Card className="border-red-500/40 bg-red-500/5 shadow-sm">
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 bg-red-500/15 rounded-full flex items-center justify-center shrink-0">
                                        <AlertTriangle size={16} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-foreground">
                                            Accident Report
                                        </p>
                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                                            Action Required
                                        </Badge>
                                    </div>
                                    {activeDispatch.severity && (
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] capitalize shrink-0",
                                                activeDispatch.severity === "critical" && "border-red-500 text-red-600",
                                                activeDispatch.severity === "high" && "border-orange-500 text-orange-600",
                                                activeDispatch.severity === "moderate" && "border-yellow-500 text-yellow-600",
                                                activeDispatch.severity === "minor" && "border-green-500 text-green-600",
                                            )}
                                        >
                                            {activeDispatch.severity}
                                        </Badge>
                                    )}
                                </div>

                                <Separator />

                                <div className="space-y-2.5">
                                    <div className="flex items-start gap-2.5">
                                        <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={13} className="text-red-600" />
                                        </div>
                                        <span className="text-sm text-foreground">
                                            {activeDispatch.location_address
                                                ?? `${activeDispatch.latitude?.toFixed(5)}, ${activeDispatch.longitude?.toFixed(5)}`}
                                        </span>
                                    </div>

                                    {activeDispatch.landmark && (
                                        <div className="flex items-start gap-2.5">
                                            <div className="w-7 h-7 flex items-center justify-center shrink-0">
                                                <MapPin size={13} className="text-muted-foreground/40" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Near: {activeDispatch.landmark}
                                            </span>
                                        </div>
                                    )}

                                    {activeDispatch.created_at && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                                                <Clock size={13} className="text-red-600" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Reported at{" "}
                                                {new Date(activeDispatch.created_at).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    )}

                                    {activeDispatch.reporter_notes && (
                                        <p className="text-xs text-muted-foreground bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                                            {`"${activeDispatch.reporter_notes}"`}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-11 border-muted-foreground/30 font-semibold"
                                        onClick={handleDecline}
                                        disabled={isAccepting}
                                    >
                                        Decline
                                    </Button>
                                    <Button
                                        className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-bold"
                                        onClick={handleAccept}
                                        disabled={isAccepting}
                                    >
                                        {isAccepting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Accepting...
                                            </span>
                                        ) : (
                                            "Accept →"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Active / En Route Card */}
                {activeDispatch && dispatchStatus === "accepted" && (
                    <div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                            Active Incident
                        </p>
                        <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-red-600/5">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-500/15 rounded-full flex items-center justify-center shrink-0">
                                    <Siren size={18} className="text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-foreground">En Route</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {activeDispatch.location_address ?? "View on map"}
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white shrink-0"
                                    onClick={onAcceptDispatch}
                                >
                                    Open Map
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Empty state */}
                {!activeDispatch && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 size={28} className="text-red-400" />
                        </div>
                        <p className="font-semibold text-foreground">No Active Dispatches</p>
                        <p className="text-sm text-muted-foreground max-w-[220px]">
                            {isAvailable
                                ? "You'll be notified when an incident is dispatched to you."
                                : "You're currently offline. Toggle available to receive dispatches."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}