import { Popup } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "../interface/get-all-reports-bystander.interface";
import { useState } from "react";
import { DateTime } from "luxon";
import {
  AlertTriangle,
  AlertCircle,
  MapPin,
  Navigation,
  Eye,
} from "lucide-react";
import { AccidentReportDetailsDialog } from "./accident-report-details-dialog";
import { ResponderConfirmationDialog } from "./responder-confirmation-dialog";

interface MapPopupProps {
  accident: Report;
  onGetDirections: (lat: number, lng: number) => void;
  additionalReports?: Report[];
  totalCount?: number;
}

export function MapPopup({
  accident,
  onGetDirections,
  additionalReports,
  totalCount = 1
}: MapPopupProps) {
  const selectedReport = accident;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const hasMultipleReports = totalCount > 1 && additionalReports;

  const handleGetDirectionsClick = (lat: number, lng: number) => {
    setPendingCoordinates({ lat, lng });
    setIsConfirmationOpen(true);
  };

  const handleConfirmResponse = () => {
    if (pendingCoordinates) {
      onGetDirections(pendingCoordinates.lat, pendingCoordinates.lng);
      setPendingCoordinates(null);
    }
  };

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
          <div className={`${selectedReport.severity.toLowerCase() === "critical" ? "bg-red-50 border-red-600" : "bg-orange-50 border-orange-600"} border-l-2 p-1 mb-1.5 rounded`}>
            <div className="flex items-center gap-1">
              <AlertCircle className={`w-3.5 h-3.5 ${selectedReport.severity.toLowerCase() === "critical" ? "text-red-600" : "text-orange-600"} shrink-0`} />
              <div>
                <p className={`text-[10px] font-bold ${selectedReport.severity.toLowerCase() === "critical" ? "text-red-900" : "text-orange-900"} uppercase leading-none`}>
                  {selectedReport.severity.toLowerCase() === "critical" ? "Urgent" : "High Risk"}
                </p>
                <p className={`text-[9px] ${selectedReport.severity.toLowerCase() === "critical" ? "text-red-700" : "text-orange-700"} leading-tight`}>
                  {selectedReport.severity.toLowerCase() === "critical" ? "Immediate attention" : "Dangerous road condition"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-1.5">
          <div className="flex justify-between items-center mb-0.5">
            <h3 className="text-[10px] font-bold text-gray-900">
              #{selectedReport.report_number}
            </h3>
            <span className={`${getSeverityColor(selectedReport.severity)} text-white px-1 py-0.5 rounded text-[8px] font-bold uppercase`}>
              {selectedReport.severity}
            </span>
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

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleGetDirectionsClick(selectedReport.latitude, selectedReport.longitude)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            Navigate
          </button>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Full Details
          </button>
        </div>
      </div>

      <AccidentReportDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        report={selectedReport}
        onGetDirections={handleGetDirectionsClick}
      />
      <ResponderConfirmationDialog
        isOpen={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        onConfirm={handleConfirmResponse}
      />
    </Popup>
  );
}