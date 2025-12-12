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
} from "lucide-react";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { ResponderConfirmationDialog } from "./responder-confirmation-dialog";

interface AccidentReportDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  report: {
    id: string;
    created_at: string;
    updated_at: string;
    report_number: string;
    severity: "minor" | "moderate" | "high" | 'critical' | string;
    reporter_name: string;
    reporter_contact: string;
    reporter_notes: string;
    latitude: number;
    longitude: number;
    location_address: string;
    barangay: string | null;
    municipality: string | null;
    province: string | null;
    landmark: string | null;
    imageUrl: string[];
  };
  onGetDirections: (lat: number, lng: number) => void;
}

export function AccidentReportDetailsDialog({
  isOpen,
  onOpenChange,
  report,
  onGetDirections,
}: AccidentReportDetailsDialogProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetDirectionsClick = (lat: number, lng: number) => {
    setPendingCoordinates({ lat, lng });
    setIsConfirmationOpen(true);
  };

  const handleConfirmResponse = () => {
    if (pendingCoordinates) {
      onGetDirections(pendingCoordinates.lat, pendingCoordinates.lng);
      setPendingCoordinates(null);
      onOpenChange(false);
    }
  };

  return (
    <>
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

          {report.imageUrl && report.imageUrl.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Camera className="w-3.5 h-3.5 text-gray-900" />
                <h3 className="text-xs font-semibold text-gray-900">Images</h3>
              </div>
              <div className="space-y-2">
                {report.imageUrl.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Accident scene ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
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

          {/* Location Details */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <MapPinned className="w-3.5 h-3.5 text-gray-900" />
              <h3 className="text-xs font-semibold text-gray-900">Location Details</h3>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-lg space-y-1.5">
              <div>
                <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Address</p>
                <p className="text-xs text-gray-900">{report.location_address}</p>
              </div>
              {(report.barangay || report.municipality || report.province) && (
                <div className="grid grid-cols-3 gap-2 mt-2">
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
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Landmark className="w-3 h-3 text-gray-600" />
                    <p className="text-[10px] text-gray-600 font-semibold">Landmark</p>
                  </div>
                  <p className="text-xs text-gray-900">{report.landmark}</p>
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-[10px] text-gray-600 font-semibold mb-0.5">Coordinates</p>
                <p className="text-xs text-gray-900 font-mono">
                  {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Reporter Information */}
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

          {/* Timestamps */}
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

          {/* Action Button */}
          <div className="pt-2 border-t">
            <button
              onClick={() => handleGetDirectionsClick(report.latitude, report.longitude)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <ResponderConfirmationDialog
      isOpen={isConfirmationOpen}
      onOpenChange={setIsConfirmationOpen}
      onConfirm={handleConfirmResponse}
    />
    </>
  );
}
