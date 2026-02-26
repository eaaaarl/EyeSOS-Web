import { DateTime } from "luxon";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  User,
  FileText,
  Calendar,
  Phone,
  MapPinned,
  Landmark,
  Clock,
  Camera,
  Crosshair,
  Signal,
  ImageOff,
} from "lucide-react";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "@/features/maps/interfaces/get-all-reports-bystander.interface";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

interface AccidentReportDetailsDialogProps {
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
        <span className="text-[10px] font-medium font-poppins">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border shadow-sm bg-slate-50">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse bg-gray-100">
          <Camera className="w-6 h-6 text-gray-300" />
          <span className="text-[10px] text-gray-400 font-medium font-poppins tracking-tight">Loading incident capture...</span>
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

interface ReportContentProps {
  report: Report;
}

const ReportContent = ({ report }: ReportContentProps) => {
  const locationQualityInfo = getLocationQualityInfo(report.location_quality);
  const formattedAccuracy = formatAccuracy(report.location_accuracy);

  return (
    <div className="space-y-4 px-1 pb-6 overflow-y-auto no-scrollbar font-poppins">
      {report.severity.toLowerCase() === "critical" && (
        <div className="bg-red-50/80 border-l-4 border-red-600 p-3 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-red-900 tracking-tight">LIFE-THREATENING INCIDENT</p>
              <p className="text-[10px] sm:text-[12px] font-semibold text-red-700">Immediate first response and medical dispatch required</p>
            </div>
          </div>
        </div>
      )}

      {report.accident_images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-red-600" />
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">
                Visual Evidence ({report.accident_images.length})
              </h3>
            </div>
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

      {report.reporter_notes && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">Incident Background</h3>
          </div>
          <p className="text-[11px] sm:text-[13px] leading-relaxed font-semibold text-gray-800 bg-red-50/40 p-3 rounded-xl border border-red-100/30">
            {report.reporter_notes}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPinned className="w-4 h-4 text-red-600" />
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">Precise Location</h3>
        </div>
        <div className="bg-white border border-gray-100 p-4 rounded-xl space-y-4 shadow-sm">
          <div>
            <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-400 font-bold mb-1">Street Address</p>
            <p className="text-[13px] sm:text-[15px] font-semibold text-gray-900 leading-snug">{report.location_address}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-gray-500">
                <Signal className={`w-3 h-3 ${locationQualityInfo.icon}`} />
                <p className="text-[9px] sm:text-[11px] uppercase tracking-widest font-bold">Quality</p>
              </div>
              <span className={`${locationQualityInfo.color} px-2.5 py-1 rounded inline-flex items-center text-[10px] sm:text-[12px] font-bold uppercase shadow-xs`}>
                {locationQualityInfo.label}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-gray-500">
                <Crosshair className="w-3 h-3" />
                <p className="text-[9px] sm:text-[11px] uppercase tracking-widest font-bold">Accuracy</p>
              </div>
              <span className="text-[12px] sm:text-[14px] text-gray-900 font-bold">{formattedAccuracy}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
            {report.barangay && (
              <div>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Barangay</p>
                <p className="text-[11px] sm:text-[13px] font-semibold text-gray-900 truncate">{report.barangay}</p>
              </div>
            )}
            {report.municipality && (
              <div>
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">City</p>
                <p className="text-[11px] sm:text-[13px] font-semibold text-gray-900 truncate">{report.municipality}</p>
              </div>
            )}
            {report.landmark && (
              <div className="min-w-0">
                <div className="flex items-center gap-1 mb-0.5 text-gray-400">
                  <Landmark className="w-2.5 h-2.5" />
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold">Landmark</p>
                </div>
                <p className="text-[11px] sm:text-[13px] font-semibold text-red-600 truncate">{report.landmark}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-red-600" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">Reporter</h3>
          </div>
          <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
            <p className="text-[12px] sm:text-[14px] font-bold text-gray-900 mb-0.5">{report.reporter_name}</p>
            {report.reporter_contact && (
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50">
                <Phone className="w-3 h-3 text-green-600" />
                <p className="text-[11px] sm:text-[13px] font-semibold text-gray-700 tracking-tight">{report.reporter_contact}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600" />
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-tighter">Timestamp</h3>
          </div>
          <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-3 h-3 text-gray-400" />
              <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-gray-400 font-bold">Logged At</p>
            </div>
            <p className="text-[11px] sm:text-[13px] font-bold text-gray-900 leading-tight">
              {DateTime.fromISO(report.created_at).toFormat("h:mm a")}
            </p>
            <p className="text-[9px] sm:text-[11px] font-semibold text-gray-500 mt-0.5">
              {DateTime.fromISO(report.created_at).toFormat("MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AccidentReportDetailsDialog({
  isOpen,
  onOpenChange,
  report,
}: AccidentReportDetailsDialogProps) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] rounded-t-[2.5rem] bg-white border-none outline-none shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden [&>div:first-child]:hidden font-poppins">
          <div className="mx-auto mt-4 h-1.5 w-16 shrink-0 rounded-full bg-gray-200 mb-4" />
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-linear-to-r from-red-50 to-white sticky top-0 z-10">
            <div>
              <DrawerHeader className="p-0 text-left">
                <DrawerTitle className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">
                  Incident Report
                </DrawerTitle>
                <DrawerDescription className="text-[10px] uppercase font-bold tracking-widest text-red-600">
                  REF: #{report.report_number.toUpperCase()}
                </DrawerDescription>
              </DrawerHeader>
            </div>
            <div className={`${getSeverityColor(report.severity)} text-white px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tighter shadow-sm`}>
              {report.severity}
            </div>
          </div>

          <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-100px)]">
            <ReportContent
              report={report}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-2xl font-poppins">
        <div className="bg-linear-to-r from-red-50/80 to-white px-6 py-5 flex items-center justify-between border-b border-red-100/30">
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-6 bg-red-600 rounded-full" />
              Incident Details
            </DialogTitle>
            <DialogDescription className="text-[10px] text-red-600/70 font-bold uppercase tracking-widest">
              Report Tracking ID: #{report.report_number.toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          <div className={`${getSeverityColor(report.severity)} text-white px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-tighter shadow-sm`}>
            {report.severity}
          </div>
        </div>

        <div className="px-4 py-6 overflow-y-auto">
          <ReportContent
            report={report}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
