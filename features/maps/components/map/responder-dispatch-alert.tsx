"use client";

import React, { useState, useEffect } from "react";
import {
    AlertTriangle,
    MapPin,
    CheckCircle,
    XCircle,
    Navigation,
    Clock,
    ShieldCheck,
    ChevronRight,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { DateTime } from "luxon";
import { Report } from "../../interfaces/get-all-reports-bystander.interface";

interface ResponderDispatchAlertProps {
    onAccept?: (report: Report) => void;
    onReject?: () => void;
}

export function ResponderDispatchAlert({ onAccept, onReject }: ResponderDispatchAlertProps) {
    const [dispatch, setDispatch] = useState<Report | null>(null);
    const [status, setStatus] = useState<"notified" | "accepted" | "resolved" | null>(null);

    // Mock a dispatch after 5 seconds for demonstration
    useEffect(() => {
        const timer = setTimeout(() => {
            setDispatch({
                id: "mock-123",
                report_number: "ACC-2026-001",
                severity: "critical",
                location_address: "Poblacion, Lianga, Surigao del Sur (Near Municipal Hall)",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                reported_by: "system-mock",
                reporter_name: "John Doe",
                reporter_contact: "09123456789",
                reporter_notes: "Multiple vehicle collision observed. Smoke coming from one vehicle.",
                latitude: 8.6301417,
                longitude: 126.0932737,
                barangay: "Poblacion",
                municipality: "Lianga",
                province: "Surigao del Sur",
                landmark: "Municipal Hall",
                accident_images: []
            } as Report);
            setStatus("notified");
            toast.info("🚨 NEW EMERGENCY DISPATCH RECEIVED!");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setStatus("accepted");
        toast.success("Dispatch accepted. Navigate to the location immediately.");
        if (dispatch && onAccept) onAccept(dispatch);
    };

    const handleReject = () => {
        setDispatch(null);
        setStatus(null);
        toast.error("Dispatch rejected. Please provide a reason to the dispatcher.");
        if (onReject) onReject();
    };

    const handleResolve = () => {
        setStatus("resolved");
        toast.success("Incident marked as resolved. Great job!");
        setTimeout(() => {
            setDispatch(null);
            setStatus(null);
        }, 3000);
    };

    if (!dispatch) return null;

    return (
        <div className="absolute top-20 inset-x-4 z-[2000] flex justify-center animate-in fade-in slide-in-from-top duration-500">
            <Card className={`w-full max-w-md shadow-2xl border-2 ${status === "notified" ? "border-red-500 bg-red-50/95" :
                status === "accepted" ? "border-green-500 bg-green-50/95" :
                    "border-zinc-200 bg-white"
                } backdrop-blur-sm overflow-hidden`}>
                <CardContent className="p-0">
                    {/* Header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${status === "notified" ? "bg-red-600 text-white" :
                        status === "accepted" ? "bg-green-600 text-white" :
                            "bg-zinc-800 text-white"
                        }`}>
                        <div className="flex items-center gap-2">
                            {status === "notified" ? <Bell className="w-5 h-5 animate-bounce" /> : <ShieldCheck className="w-5 h-5" />}
                            <h2 className="font-bold text-sm tracking-tight uppercase">
                                {status === "notified" && "Emergency Dispatch"}
                                {status === "accepted" && "Currently Responding"}
                                {status === "resolved" && "Incident Resolved"}
                            </h2>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">#{dispatch.report_number}</span>
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
                            <div className="pl-6 border-l-2 border-zinc-100 py-1">
                                <p className="text-[10px] text-zinc-500 italic">
                                    &quot;{dispatch.reporter_notes}&quot;
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            {status === "notified" && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={handleReject}
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 font-bold h-11"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        REJECTING
                                    </Button>
                                    <Button
                                        onClick={handleAccept}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-11"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        ACCEPT
                                    </Button>
                                </div>
                            )}

                            {status === "accepted" && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 py-2 text-green-700 animate-pulse bg-green-100/50 rounded-lg border border-green-200">
                                        <Navigation className="w-4 h-4" />
                                        <span className="text-[11px] font-bold uppercase">En Route to Incident</span>
                                    </div>
                                    <Button
                                        onClick={handleResolve}
                                        className="w-full bg-zinc-900 hover:bg-black text-white font-bold h-11"
                                    >
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        MARK AS RESOLVED
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

                    {/* Footer indicator */}
                    <div className="px-4 py-2 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                        <span className="text-[9px] text-zinc-400 font-medium tracking-wider uppercase">EyeSOS Dispatch System</span>
                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
