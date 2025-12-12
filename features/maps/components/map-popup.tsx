import { Popup } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "../interface/get-all-reports-bystander.interface";
import { useState } from "react";
import { DateTime } from "luxon";
import {
  AlertTriangle,
  AlertCircle,
  MapPin,
  User,
  FileText,
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
  const [selectedReport, setSelectedReport] = useState<Report>(accident);
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
      <div className="w-[240px] font-sans">
        {hasMultipleReports && (
          <div className="bg-orange-50 border-l-4 border-orange-600 p-1.5 mb-2 rounded">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-orange-900">
                  {totalCount} REPORTS
                </p>
                <p className="text-[10px] text-orange-700">
                  Multiple reports at this location
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedReport.severity.toLowerCase() === "critical" && (
          <div className="bg-red-50 border-l-4 border-red-600 p-1.5 mb-2 rounded">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-red-900">URGENT</p>
                <p className="text-[10px] text-red-700">Immediate attention needed</p>
              </div>
            </div>
          </div>
        )}

        {hasMultipleReports && (
          <div className="mb-2">
            <label className="text-[10px] font-semibold text-gray-700 mb-0.5 block">
              SELECT REPORT:
            </label>
            <select
              value={selectedReport.id}
              onChange={(e) => {
                const report = additionalReports.find(r => r.id === e.target.value);
                if (report) setSelectedReport(report);
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {additionalReports.map((report, idx) => (
                <option key={report.id} value={report.id}>
                  #{idx + 1} - {report.severity} - {new Date(report.created_at).toLocaleTimeString()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Accident Report
            </h3>
            <span className={`${getSeverityColor(selectedReport.severity)} text-white px-1.5 py-0.5 rounded text-[10px] font-semibold`}>
              {selectedReport.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-[10px] text-gray-600">
            #{selectedReport.report_number} • {DateTime.fromISO(selectedReport.created_at).toFormat("MMM dd, h:mm a")}
          </p>
        </div>

        {selectedReport.imageUrl && selectedReport.imageUrl.length > 0 && (
          <img
            src={selectedReport.imageUrl[0]}
            alt="Accident scene"
            className="w-full h-24 object-cover rounded mb-2"
          />
        )}

        {selectedReport.reporter_notes && (
          <div className="mb-2">
            <p className="text-xs leading-tight text-gray-700 line-clamp-2">
              {selectedReport.reporter_notes}
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-1.5 rounded mb-2">
          <div className="mb-1">
            <div className="flex items-center gap-1 mb-0.5">
              <MapPin className="w-3 h-3 text-gray-600" />
              <p className="text-[10px] text-gray-600 font-semibold">
                LOCATION
              </p>
            </div>
            <p className="text-xs text-gray-900 mt-0.5 line-clamp-2">
              {selectedReport.location_address}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <User className="w-3 h-3 text-gray-600" />
              <p className="text-[10px] text-gray-600 font-semibold">
                REPORTER
              </p>
            </div>
            <p className="text-xs text-gray-900 mt-0.5">
              {selectedReport.reporter_name}
            </p>
          </div>
        </div>

        {hasMultipleReports && (
          <div className="bg-blue-50 p-1.5 rounded mb-2">
            <div className="flex items-center gap-1 mb-1">
              <FileText className="w-3 h-3 text-blue-900" />
              <p className="text-[10px] font-semibold text-blue-900">
                ALL REPORTS:
              </p>
            </div>
            <div className="space-y-0.5 max-h-20 overflow-y-auto">
              {additionalReports.map((report, idx) => (
                <div
                  key={report.id}
                  className={`text-[10px] p-1 rounded cursor-pointer transition-colors ${selectedReport.id === report.id
                    ? 'bg-blue-200 border border-blue-400'
                    : 'bg-white border border-blue-200 hover:bg-blue-100'
                    }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <span className="font-semibold">#{idx + 1}</span> - {report.severity} - {report.reporter_name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <button
            onClick={() => handleGetDirectionsClick(selectedReport.latitude, selectedReport.longitude)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </button>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            View Full Details
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