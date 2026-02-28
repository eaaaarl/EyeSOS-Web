"use client";

import { DateTime } from "luxon";
import { useState } from "react";
import {
    AlertCircle,
    User,
    FileText,
    Phone,
    MapPinned,
    Landmark,
    Clock,
    Camera,
    Crosshair,
    Signal,
    ImageOff,
    CheckCircle2,
} from "lucide-react";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import Image from "next/image";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer";

interface ResponderReportDetailsDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    report: Report;
}

const getLocationQualityInfo = (quality?: string) => {
    if (!quality) return { color: "bg-gray-100 text-gray-700", label: "Unknown", icon: "text-gray-500" };
    const q = quality.toLowerCase();
    if (q === "high" || q === "excellent") return { color: "bg-green-100 text-green-800", label: quality, icon: "text-green-600" };
    if (q === "medium" || q === "good") return { color: "bg-yellow-100 text-yellow-800", label: quality, icon: "text-yellow-600" };
    if (q === "low" || q === "poor") return { color: "bg-red-100 text-red-800", label: quality, icon: "text-red-600" };
    return { color: "bg-gray-100 text-gray-700", label: quality, icon: "text-gray-500" };
};

const formatAccuracy = (accuracy?: string) => {
    if (!accuracy) return "N/A";
    const numAccuracy = parseFloat(accuracy);
    if (!isNaN(numAccuracy)) {
        return numAccuracy < 1000 ? `±${numAccuracy.toFixed(0)}m` : `±${(numAccuracy / 1000).toFixed(1)}km`;
    }
    return accuracy;
};

function AccidentImage({ url, reportNumber }: { url: string; reportNumber: string }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-100 bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                <ImageOff className="w-6 h-6 opacity-30" />
                <span className="text-[10px] font-medium">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-50">
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse bg-gray-100">
                    <Camera className="w-6 h-6 text-gray-300" />
                    <span className="text-[10px] text-gray-400 font-medium">Loading incident capture...</span>
                </div>
            )}
            <Image
                src={url}
                alt={`Accident report ${reportNumber}`}
                fill
                className={`object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setError(true); }}
            />
        </div>
    );
}

export function ResponderReportDetailsDrawer({
    isOpen,
    onOpenChange,
    report,
}: ResponderReportDetailsDrawerProps) {
    const locationQualityInfo = getLocationQualityInfo(report.location_quality);
    const formattedAccuracy = formatAccuracy(report.location_accuracy);

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[95vh] rounded-t-[2rem] bg-white border-none outline-none shadow-2xl overflow-hidden font-poppins">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
                    <div>
                        <DrawerTitle className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
                            Mission Update
                        </DrawerTitle>
                        <DrawerDescription className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                            Unit Ref: #{report.report_number.slice(-8).toUpperCase()}
                        </DrawerDescription>
                    </div>
                    <div className={`${getSeverityColor(report.severity)} text-white px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tight shadow-sm`}>
                        {report.severity}
                    </div>
                </div>

                {/* Content - with large bottom padding to clear nav */}
                <div className="px-6 pt-4 pb-4 overflow-y-auto max-h-[calc(95vh-100px)] space-y-5">

                    {/* Critical Alert */}
                    {report.severity.toLowerCase() === "critical" && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 grow-0" />
                                <div className="text-xs font-bold text-red-900">
                                    HIGH-PRIORITY INTERVENTION REQUIRED
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resolved Status */}
                    {report.accident_status === "RESOLVED" && (
                        <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 grow-0" />
                                <div className="text-xs font-bold text-green-900">
                                    INCIDENT SECURED & RESOLVED
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {(report.accident_images?.length ?? 0) > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Camera className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Visual Recon</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {report.accident_images.map((image, index) => (
                                    <AccidentImage
                                        key={index}
                                        url={image.url}
                                        reportNumber={report.report_number}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {report.reporter_notes && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Dispatch Notes</h3>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[13px] font-medium text-slate-700 italic">
                                &ldquo;{report.reporter_notes}&rdquo;
                            </div>
                        </div>
                    )}

                    {/* Location Details */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <MapPinned className="w-4 h-4 text-slate-400" />
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Area Intel</h3>
                        </div>
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl space-y-4 shadow-sm">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Target Coordinates / Address</p>
                                <p className="text-[14px] font-bold text-slate-900 leading-snug">{report.location_address}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                                        <Signal className={`w-3 h-3 ${locationQualityInfo.icon}`} />
                                        <p className="text-[9px] uppercase tracking-widest font-bold">Signal Quality</p>
                                    </div>
                                    <span className={`${locationQualityInfo.color} px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>
                                        {locationQualityInfo.label}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                                        <Crosshair className="w-3 h-3" />
                                        <p className="text-[9px] uppercase tracking-widest font-bold">GPS Accuracy</p>
                                    </div>
                                    <span className="text-[12px] text-slate-900 font-bold">{formattedAccuracy}</span>
                                </div>
                            </div>

                            {report.landmark && (
                                <div className="pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-1 mb-1 text-slate-400">
                                        <Landmark className="w-3 h-3" />
                                        <p className="text-[9px] uppercase tracking-widest font-bold">Key Landmark</p>
                                    </div>
                                    <p className="text-[13px] font-bold text-red-600 underline decoration-red-200 underline-offset-4">{report.landmark}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reporter & Contact */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Source</h3>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[13px] font-bold text-slate-900">{report.reporter_name}</p>
                                {report.reporter_contact && (
                                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-200/50 text-blue-600">
                                        <Phone className="w-3 h-3" />
                                        <a href={`tel:${report.reporter_contact}`} className="text-[12px] font-bold tracking-tight">{report.reporter_contact}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Timeline</h3>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[13px] font-bold text-slate-900">
                                    {DateTime.fromISO(report.created_at).toFormat("h:mm a")}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                    {DateTime.fromISO(report.created_at).toFormat("MMM dd, yyyy")}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    );
}
