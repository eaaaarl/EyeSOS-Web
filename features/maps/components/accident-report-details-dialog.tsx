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
  Navigation,
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
import { Report } from "@/features/maps/interface/get-all-reports-bystander.interface";
import Image from "next/image";

interface AccidentReportDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report;
  onGetDirections: (lat: number, lng: number) => void;
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
      <div className="w-full aspect-video rounded-lg border bg-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400">
        <ImageOff className="w-6 h-6" />
        <span className="text-[10px]">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-gray-100">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 animate-pulse">
          <Camera className="w-6 h-6 text-gray-300" />
          <span className="text-[10px] text-gray-400">Loading image...</span>
        </div>
      )}
      <Image
        src={url}
        alt={`Accident report ${reportNumber}`}
        fill
        className={`object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />
    </div>
  );
}

export function AccidentReportDetailsDialog({
  isOpen,
  onOpenChange,
  report,
  onGetDirections,
}: AccidentReportDetailsDialogProps) {
  const locationQualityInfo = getLocationQualityInfo(report.location_quality);
  const formattedAccuracy = formatAccuracy(report.location_accuracy);

  const handleGetDirectionsClick = () => {
    onGetDirections(report.latitude, report.longitude);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center justify-between text-base">
            <span>Accident Report Details</span>
            <span className={`${getSeverityColor(report.severity)} text-white px-2 py-0.5 mr-5 rounded text-xs font-semibold`}>
              {report.severity.toUpperCase()}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Report #{report.report_number} • {DateTime.fromISO(report.created_at).toFormat("MMMM dd, yyyy 'at' h:mm a")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {report.severity.toLowerCase() === "critical" && (
            <div className="bg-red-50 border-l-4 border-red-600 p-2 rounded">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-900">URGENT</p>
                  <p className="text-[10px] text-red-700">Immediate attention needed</p>
                </div>
              </div>
            </div>
          )}

          {report.accident_images.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Camera className="w-3.5 h-3.5 text-gray-900" />
                <h3 className="text-xs font-semibold text-gray-900">
                  Images ({report.accident_images.length})
                </h3>
              </div>
              <div className="space-y-2">
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
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <FileText className="w-3.5 h-3.5 text-gray-900" />
                <h3 className="text-xs font-semibold text-gray-900">Description</h3>
              </div>
              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                {report.reporter_notes}
              </p>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPinned className="w-3.5 h-3.5 text-gray-900" />
              <h3 className="text-xs font-semibold text-gray-900">Location Details</h3>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg space-y-2">
              <div>
                <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Address</p>
                <p className="text-xs text-gray-900">{report.location_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Signal className={`w-3.5 h-3.5 ${locationQualityInfo.icon}`} />
                    <p className="text-[10px] text-gray-600 font-semibold">Location Quality</p>
                  </div>
                  <span className={`${locationQualityInfo.color} px-2 py-1 rounded text-[10px] font-semibold inline-block`}>
                    {locationQualityInfo.label}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Crosshair className="w-3.5 h-3.5 text-gray-600" />
                    <p className="text-[10px] text-gray-600 font-semibold">Location Accuracy</p>
                  </div>
                  <span className="text-xs text-gray-900 font-semibold">{formattedAccuracy}</span>
                </div>
              </div>

              {(report.barangay || report.municipality || report.province) && (
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                  {report.barangay && (
                    <div>
                      <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Barangay</p>
                      <p className="text-xs text-gray-900">{report.barangay}</p>
                    </div>
                  )}
                  {report.municipality && (
                    <div>
                      <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Municipality</p>
                      <p className="text-xs text-gray-900">{report.municipality}</p>
                    </div>
                  )}
                  {report.province && (
                    <div>
                      <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Province</p>
                      <p className="text-xs text-gray-900">{report.province}</p>
                    </div>
                  )}
                </div>
              )}

              {report.landmark && (
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Landmark className="w-3 h-3 text-gray-600" />
                    <p className="text-[10px] text-gray-600 font-semibold">Landmark</p>
                  </div>
                  <p className="text-xs text-gray-900">{report.landmark}</p>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Coordinates</p>
                <p className="text-xs text-gray-900 font-mono">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-gray-900" />
              <h3 className="text-xs font-semibold text-gray-900">Reporter Information</h3>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg space-y-1.5">
              <div>
                <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Name</p>
                <p className="text-xs text-gray-900">{report.reporter_name}</p>
              </div>
              {report.reporter_contact && (
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <Phone className="w-3 h-3 text-gray-600" />
                    <p className="text-[10px] text-gray-600 font-semibold">Contact</p>
                  </div>
                  <p className="text-xs text-gray-900">{report.reporter_contact}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-900" />
              <h3 className="text-xs font-semibold text-gray-900">Timestamps</h3>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg space-y-1.5">
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3 text-gray-600" />
                  <p className="text-[10px] text-gray-600 font-semibold">Reported At</p>
                </div>
                <p className="text-xs text-gray-900">
                  {DateTime.fromISO(report.created_at).toFormat("MMMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              {report.updated_at && report.updated_at !== report.created_at && (
                <div>
                  <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Last Updated</p>
                  <p className="text-xs text-gray-900">
                    {DateTime.fromISO(report.updated_at).toFormat("MMMM dd, yyyy 'at' h:mm a")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t">
            <button
              onClick={handleGetDirectionsClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}