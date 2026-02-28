"use client";

import { useState } from "react";
import { Navigation, Eye, Siren } from "lucide-react";
import { Report } from "../../maps/interfaces/get-all-reports-bystander.interface";
import { getSeverityColor } from "../../maps/utils/severityColor";
import { ResponderReportDetailsDrawer } from "./responder-report-details-drawer";
import { useCurrentLocation } from "../../maps/hooks/use-current-location";
import { toast } from "sonner";

interface ResponderBottomReportsProps {
    report: Report;
    onDrawerChange?: (open: boolean) => void;
}

export function ResponderBottomReports({ report, onDrawerChange }: ResponderBottomReportsProps) {
    const { getCurrentLocation, isLoading: isFetchingLocation } = useCurrentLocation();
    const [isNavigating, setIsNavigating] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const handleDetailsChange = (open: boolean) => {
        setIsDetailsOpen(open);
        onDrawerChange?.(open); // notify shell to hide/show nav
    };

    const handleNavigate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!report?.latitude || !report?.longitude) return;
        setIsNavigating(true);

        const win = window.open("", "_blank");
        if (!win) {
            setIsNavigating(false);
            toast.error("Popup blocked. Please allow popups for this site.");
            return;
        }

        try {
            const location = await getCurrentLocation();
            const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${report.latitude},${report.longitude}&travelmode=driving`;
            win.location.href = url;
        } catch (error) {
            console.error("Failed to get current location:", error);
            win.location.href = `https://www.google.com/maps/dir/?api=1&destination=${report.latitude},${report.longitude}&travelmode=driving`;
        } finally {
            setIsNavigating(false);
        }
    };

    const isResolved = report.accident_status === "RESOLVED";

    return (
        <>
            <div className="absolute bottom-4 left-3 right-3 z-[1000] animate-in slide-in-from-bottom duration-300">
                <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-100 overflow-hidden">
                    <div className={`h-0.5 w-full ${getSeverityColor(report.severity)}`} />
                    <div className="px-3 py-2.5 flex items-center gap-2.5">

                        <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                            <Siren className="w-4 h-4 text-red-600 animate-pulse" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className={`${getSeverityColor(report.severity)} text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase`}>
                                    {report.severity}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium truncate">
                                    {report.location_address}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                onClick={() => handleDetailsChange(true)}
                                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition-all active:scale-90"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNavigate}
                                disabled={isNavigating || isFetchingLocation || isResolved}
                                className="h-9 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl flex items-center gap-1.5 font-bold text-xs transition-all active:scale-95"
                            >
                                <Navigation className={`w-3.5 h-3.5 ${isNavigating || isFetchingLocation ? "animate-spin" : ""}`} />
                                Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ResponderReportDetailsDrawer
                isOpen={isDetailsOpen}
                onOpenChange={handleDetailsChange}
                report={report}
            />
        </>
    );
}