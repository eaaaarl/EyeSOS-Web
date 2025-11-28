import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "../interface/get-all-reports-bystander.interface";

interface ReportDetailsDialogProps {
  report: Report | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGetDirections: (lat: number, lng: number) => void;
}

export function ReportDetailsDialog({
  report,
  isOpen,
  onOpenChange,
  onGetDirections
}: ReportDetailsDialogProps) {
  if (!report) return null;

  const imageUrl = Array.isArray(report.imageUrl) ? report.imageUrl[0] : report.imageUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Road Accident Report</span>
            <span className={`${getSeverityColor(report.severity)} text-white px-3 py-1 rounded-md text-xs font-semibold`}>
              {report.severity.toUpperCase()}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {report.severity === "Critical" && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🚨</span>
                <div>
                  <p className="text-sm font-bold text-red-900">URGENT RESPONSE NEEDED</p>
                  <p className="text-xs text-red-700">High priority accident requiring immediate attention</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-600">
            Report ID: #{report.report_number} • {new Date(report.created_at).toLocaleString()}
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Accident scene"
              className="w-full h-64 object-cover rounded-xl"
            />
          )}

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Description:</p>
            <p className="text-sm leading-relaxed text-gray-700">
              {report.reporter_notes}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-1">
                📍 LOCATION
              </p>
              <p className="text-sm text-gray-900">
                {report.location_address}
              </p>
              {report.landmark && (
                <p className="text-xs text-gray-600 mt-1">
                  Landmark: {report.landmark}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-1">
                👤 REPORTED BY
              </p>
              <p className="text-sm text-gray-900">
                {report.reporter_name}
              </p>
              {report.reporter_contact && (
                <p className="text-xs text-gray-600 mt-1">
                  Contact: {report.reporter_contact}
                </p>
              )}
            </div>
            {report.barangay && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">
                  📋 AREA
                </p>
                <p className="text-sm text-gray-900">
                  {report.barangay}
                  {report.municipality && `, ${report.municipality}`}
                  {report.province && `, ${report.province}`}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onGetDirections(report.latitude, report.longitude);
                onOpenChange(false);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>🗺️</span>
              Get Directions (Google Maps)
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

