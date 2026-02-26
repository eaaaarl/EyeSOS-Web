"use client";

import React, { useState } from "react";
import {
    AlertTriangle, MapPin, CheckCircle, XCircle,
    Clock, ShieldCheck, ChevronRight, Bell,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { Report } from "../../maps/interfaces/get-all-reports-bystander.interface";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetResponderDispatchQuery, useUpdateAccidentResponseStatusMutation, useUpdateAccidentStatusMutation, useUpdateResponderAvailabilityMutation } from "../api/responderApi";

interface ResponderDispatchAlertProps {
    status: "notified" | "accepted" | "resolved" | null;
    onStatusChange: (status: "notified" | "accepted" | "resolved" | null) => void;
    onAccept?: (report: Report) => void;
    onReject?: () => void;
}

export function ResponderDispatchAlert({ status, onStatusChange, onAccept, onReject }: ResponderDispatchAlertProps) {
    const { user } = useAppSelector((state) => state.auth);
    const { data } = useGetResponderDispatchQuery(user?.id ?? "", {
        skip: !user?.id,
    });
    const [activeAction, setActiveAction] = useState<"accept" | "reject" | null>(null);

    const dispatch = data?.accident ?? null;
    const [updateResponderAvailability, { isLoading: isUpdatingAvailability }] = useUpdateResponderAvailabilityMutation();
    const [updateAccidentStatus, { isLoading: isUpdatingAccidentStatus }] = useUpdateAccidentStatusMutation();
    const [updateAccidentResponseStatus, { isLoading: isUpdatingResponseStatus }] = useUpdateAccidentResponseStatusMutation();

    const isMutationLoading = isUpdatingAvailability || isUpdatingAccidentStatus || isUpdatingResponseStatus;

    const handleAccept = async () => {
        if (!dispatch || !user?.id) return;
        setActiveAction("accept");
        try {
            await Promise.all([
                updateAccidentResponseStatus({
                    responderId: user.id,
                    accidentId: dispatch.id,
                    status: 'accepted'
                }).unwrap(),
                updateAccidentStatus({
                    accidentId: dispatch.id,
                    status: "IN_PROGRESS",
                }).unwrap(),
                updateResponderAvailability({
                    responderId: user.id,
                    is_available: false,
                }).unwrap(),
            ]);
            onStatusChange("accepted");
            toast.success("Dispatch accepted. Navigate to the location immediately.");
            if (onAccept) onAccept(dispatch);
        } catch {
            toast.error("Failed to accept dispatch. Try again.");
        } finally {
            setActiveAction(null);
        }
    };

    const handleReject = async () => {
        if (!dispatch || !user?.id) return;
        setActiveAction("reject");
        try {
            await Promise.all([
                updateAccidentResponseStatus({
                    responderId: user.id,
                    accidentId: dispatch.id,
                    status: 'rejected'
                }).unwrap(),
                updateAccidentStatus({
                    accidentId: dispatch.id,
                    status: "PENDING",
                }).unwrap(),
                updateResponderAvailability({
                    responderId: user.id,
                    is_available: true,
                }).unwrap(),
            ]);
            onStatusChange(null);
            toast.error("Dispatch rejected.");
            if (onReject) onReject();
        } catch {
            toast.error("Failed to reject dispatch. Try again.");
        } finally {
            setActiveAction(null);
        }
    };

    if (!dispatch || !status) return null;

    return (
        <div className="absolute top-20 inset-x-4 z-[2000] flex justify-center animate-in fade-in slide-in-from-top duration-500">
            <Card className={`w-full max-w-md shadow-2xl border-2 ${status === "notified" ? "border-red-500 bg-red-50/95" :
                status === "accepted" ? "border-green-500 bg-green-50/95" :
                    "border-zinc-200 bg-white"
                } backdrop-blur-sm overflow-hidden`}>
                <CardContent className="p-0">
                    <div className={`px-4 py-3 flex items-center justify-between ${status === "notified" ? "bg-red-600 text-white" :
                        status === "accepted" ? "bg-green-600 text-white" :
                            "bg-zinc-800 text-white"
                        }`}>
                        <div className="flex items-center gap-2">
                            {status === "notified"
                                ? <Bell className="w-5 h-5 animate-bounce" />
                                : <ShieldCheck className="w-5 h-5" />
                            }
                            <h2 className="font-bold text-sm tracking-tight uppercase">
                                {status === "notified" && "Emergency Dispatch"}
                                {status === "accepted" && "Currently Responding"}
                                {status === "resolved" && "Incident Resolved"}
                            </h2>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">
                            #{dispatch.report_number}
                        </span>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Incident Summary */}
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full shrink-0 ${status === "notified" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                                }`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-zinc-900 leading-tight">
                                    {dispatch.severity.toUpperCase()} INCIDENT REPORTED
                                </p>
                                <div className="flex items-center gap-1.5 text-zinc-600">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px]">
                                        Reported {DateTime.fromISO(dispatch.created_at).toRelative()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white/50 border border-zinc-200 rounded-lg p-3 space-y-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-zinc-700 leading-normal font-medium">
                                    {dispatch.location_address}
                                </p>
                            </div>
                            {dispatch.reporter_notes && (
                                <div className="pl-6 border-l-2 border-zinc-100 py-1">
                                    <p className="text-[10px] text-zinc-500 italic">
                                        &quot;{dispatch.reporter_notes}&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            {status === "notified" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={handleReject}
                                        disabled={isMutationLoading}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-11"
                                    >
                                        {isMutationLoading && activeAction === "reject" ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <XCircle className="w-4 h-4 mr-2" />
                                        )}
                                        REJECT
                                    </Button>
                                    <Button
                                        onClick={handleAccept}
                                        disabled={isMutationLoading}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-11"
                                    >
                                        {isMutationLoading && activeAction === "accept" ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        )}
                                        ACCEPT
                                    </Button>
                                </div>
                            )}

                            {status === "resolved" && (
                                <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold">Good work, Responder!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-400 font-medium tracking-wider uppercase">
                            EyeSOS Dispatch System
                        </span>
                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}