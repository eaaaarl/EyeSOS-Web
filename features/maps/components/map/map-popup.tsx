import { Popup, useMap } from "react-leaflet";
import { getSeverityColor } from "@/features/maps/utils/severityColor";
import { Report } from "../../interfaces/get-all-reports-bystander.interface";
import { useState } from "react";
import { DateTime } from "luxon";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import {
  AlertTriangle,
  AlertCircle,
  MapPin,
  Navigation,
  Eye,
  Shield,
  CheckCircle2
} from "lucide-react";
import { AccidentReportDetailsDialog } from "../dialogs/accident-report-details-dialog";
import { ResponderConfirmationDialog } from "../dialogs/responder-confirmation-dialog";
import { ResponderDispatchDialog } from "../dialogs/responder-dispatch-dialog";
import { toast } from "sonner";
import { AvailableResponders } from "../../api/interface";

interface MapPopupProps {
  accident: Report;
  onGetDirections: (lat: number, lng: number) => void;
  additionalReports?: Report[];
  totalCount?: number;
  availableResponders?: AvailableResponders;
  isRespondersLoading?: boolean;
}

export function MapPopup({
  accident,
  onGetDirections,
  additionalReports,
  totalCount = 1,
  availableResponders,
  isRespondersLoading
}: MapPopupProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profileData } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );

  const isAdmin = profileData?.profile?.user_type === "lgu" || profileData?.profile?.user_type === "blgu";

  const selectedReport = accident;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const hasMultipleReports = totalCount > 1 && additionalReports;
  const resolved = accident.accident_status === "RESOLVED";
  const handleGetDirectionsClick = (lat: number, lng: number) => {
    setPendingCoordinates({ lat, lng });
    setIsConfirmationOpen(true);
  };

  const map = useMap();
  const handleConfirmResponse = async () => {
    if (pendingCoordinates) {
      try {
        onGetDirections(pendingCoordinates.lat, pendingCoordinates.lng);
        map.closePopup();
      } catch (error) {
        console.error("Failed to update status:", error);
        toast.error("Failed to send response.");
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsConfirmationOpen(open);
    if (!open) {
      setPendingCoordinates(null);
    }
  };

  return (
    <Popup maxWidth={280} className="custom-popup"  >
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
          {resolved ? (
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <Eye className="w-3 h-3" />
              View Resolved Details
            </button>
          ) : isAdmin ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsDispatchOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 shadow-sm shadow-blue-100"
              >
                <Shield className="w-3 h-3" />
                Dispatch
              </button>
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Eye className="w-3 h-3" />
                Details
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleGetDirectionsClick(selectedReport.latitude, selectedReport.longitude)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                Navigate
              </button>
              <button
                onClick={() => setIsDetailsOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-[10px] transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Full Details
              </button>
            </>
          )}
        </div>
      </div>

      <AccidentReportDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        report={selectedReport}
      />

      <ResponderDispatchDialog
        isOpen={isDispatchOpen}
        onOpenChange={setIsDispatchOpen}
        report={selectedReport}
        availableResponders={availableResponders ?? null}
        isLoading={isRespondersLoading}
      />

      <ResponderConfirmationDialog
        isOpen={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirmResponse}
        onReopenDirections={() => {
          if (pendingCoordinates) {
            onGetDirections(pendingCoordinates.lat, pendingCoordinates.lng);
          }
        }}
      />
    </Popup>
  );
}
