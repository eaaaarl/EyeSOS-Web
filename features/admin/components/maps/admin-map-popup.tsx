import { Popup } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { AccidentReport } from "../../api/interface";
import { useState } from "react";
import { DateTime } from "luxon";
import {
    AlertTriangle,
    AlertCircle,
    MapPin,
    Eye,
    CheckCircle2
} from "lucide-react";
import { AccidentReportDetailsDialog } from "@/features/dispatcher/components/accident-report-details-dialog";
import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";

interface AdminMapPopupProps {
    accident: AccidentReport;
    totalCount?: number;
}

export function AdminMapPopup({
    accident,
    totalCount = 1,
}: AdminMapPopupProps) {
    const selectedReport = accident;
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const hasMultipleReports = totalCount > 1;
    const resolved = accident.accident_status === "RESOLVED";

    return (
        <Popup maxWidth={280} className="custom-popup">
            <div className="w-[210px] font-sans">
                {hasMultipleReports && (
                    <div className="bg-orange-50 border-l-2 border-orange-600 p-1 mb-1.5 rounded">
                        <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold text-orange-900 leading-none">
                                    {totalCount} REPORTS
                                </p>
                                <p className="text-[9px] text-orange-700 leading-tight">
                                    Multiple reports here
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {(selectedReport.severity.toLowerCase() === "critical" || selectedReport.severity.toLowerCase() === "high") && (
                    <div className={`flex items-center gap-2 px-2 py-1.5 mb-1.5 rounded-md ${selectedReport.severity.toLowerCase() === "critical"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                        }`}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase leading-tight tracking-wide">
                                {selectedReport.severity.toLowerCase() === "critical" ? "Urgent Response Needed" : "High Risk Incident"}
                            </span>
                            <span className="text-[9px] leading-tight opacity-80">
                                {selectedReport.severity.toLowerCase() === "critical" ? "Immediate attention required" : "Dangerous road condition"}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mb-1.5">
                    <div className="flex justify-between items-center mb-0.5">
                        <h3 className="text-[10px] font-bold text-gray-900">
                            #{selectedReport.report_number}
                        </h3>
                        <div className="flex items-center gap-1">
                            <span className={`${getSeverityColor(selectedReport.severity)} text-white px-1 py-0.5 rounded text-[8px] font-bold uppercase`}>
                                {selectedReport.severity}
                            </span>
                            {resolved && (
                                <span className="bg-green-600 text-white px-1 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2 h-2" />
                                    Resolved
                                </span>
                            )}
                        </div>
                    </div>
                    <p className="text-[9px] text-gray-500 font-medium">
                        {DateTime.fromISO(selectedReport.created_at).toFormat("MMM dd, h:mm a")}
                    </p>
                </div>

                <div className="flex items-start gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-gray-500 shrink-0 mt-[1px]" />
                    <span className="text-[10px] text-gray-600 leading-tight line-clamp-2">
                        {selectedReport.location_address}
                    </span>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => setIsDetailsOpen(true)}
                        className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                        <Eye className="w-3 h-3" />
                        View Details
                    </button>
                </div>
            </div>

            <AccidentReportDetailsDialog
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                report={selectedReport as unknown as Report}
            />
        </Popup>
    );
}
