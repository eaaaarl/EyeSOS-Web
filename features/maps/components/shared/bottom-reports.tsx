"use client";
import { useState } from 'react';
import {
  MapPin,
  ChevronUp,
  ChevronDown,
  MessageCircleWarning,
  ChevronRight,
  Info,
  Shield,
  Eye,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { Report } from "../../interfaces/get-all-reports-bystander.interface";
import { getSeverityColor } from "../../utils/severityColor";
import { DateTime } from 'luxon';
import { AccidentReportDetailsDialog } from "../../../dispatcher/components/accident-report-details-dialog";
import { ResponderDispatchDialog } from "../../../dispatcher/components/responder-dispatch-dialog";
import { useCurrentLocation } from "../../hooks/use-current-location";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetUserProfileQuery } from "@/features/auth/api/authApi";
import { useGetAvailableRespondersQuery } from '@/features/dispatcher/api/dispatcherApi';

interface BottomReportsProps {
  reports?: Report[];
  isResponder?: boolean;
}

interface BottomTriggerProps {
  reports: Report[];
  isMobile: boolean;
  isExpanded: boolean;
  hasCritical: boolean;
}

const BottomTrigger = ({ reports, isMobile, isExpanded, hasCritical }: BottomTriggerProps) => (
  <div className="flex items-center justify-between px-4 py-2.5">
    <div className="flex items-center gap-2">
      <MessageCircleWarning className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-bold text-gray-900">
        Incident Reports
      </span>
      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {reports.length}
      </span>
    </div>
    <div className="flex items-center gap-1.5">
      {hasCritical && (
        <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          Critical
        </span>
      )}
      {isMobile ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />
      )}
    </div>
  </div>
);

export default function BottomReports({ reports = [], isResponder = false }: BottomReportsProps) {
  const isMobile = useIsMobile();
  const { user } = useAppSelector((state) => state.auth);
  const { getCurrentLocation, isLoading: isFetchingLocation } = useCurrentLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const { data: profileData } = useGetUserProfileQuery(
    { user_id: user?.id || "" },
    { skip: !user?.id }
  );
  const { data: availableResponders, isLoading: availableRespondersLoading } = useGetAvailableRespondersQuery();

  const isAdmin = profileData?.profile?.user_type === "lgu" || profileData?.profile?.user_type === "blgu";

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);

  if (!reports || reports.length === 0) {
    return null;
  }

  const hasCritical = reports.some(r => r.severity.toLowerCase() === "critical");

  const sortedReports = [...reports].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, moderate: 2, minor: 3 };
    const aOrder = severityOrder[a.severity.toLowerCase() as keyof typeof severityOrder] ?? 4;
    const bOrder = severityOrder[b.severity.toLowerCase() as keyof typeof severityOrder] ?? 4;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const reportsListContent = (
    <div className={`${isMobile ? "max-h-[60vh]" : "max-h-[400px]"} overflow-y-auto no-scrollbar`}>
      <div className="divide-y divide-gray-100 pb-8">
        {sortedReports.map((report) => (
          <div
            key={report.id}
            className="group px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-all active:bg-slate-100"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`${getSeverityColor(report.severity)} text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight`}>
                    {report.severity}
                  </span>
                  {report.accident_status === "RESOLVED" && (
                    <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tight flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Resolved
                    </span>
                  )}
                  <span className="text-[9px] font-poppins text-gray-400">#{report.report_number.slice(-4)}</span>
                </div>
                <span className="text-[9px] text-gray-400">
                  {DateTime.fromISO(report.created_at).toRelative()}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug flex-1">
                  {report.location_address}
                </p>
                {!isAdmin && <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />}
              </div>

              {isAdmin && (
                <div className="flex gap-1.5 pt-0.5">
                  {report.accident_status !== "RESOLVED" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        setIsDispatchOpen(true);
                      }}
                      className="flex-1 h-7.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-tighter rounded-md flex items-center justify-center gap-1 transition-all shadow-sm shadow-blue-100 active:scale-95"
                    >
                      <Shield className="w-3 h-3" />
                      Dispatch
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                      setIsDetailsOpen(true);
                    }}
                    className={`${report.accident_status === "RESOLVED" ? "w-full" : "flex-1"} h-7.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-[10px] font-bold uppercase tracking-tighter rounded-md flex items-center justify-center gap-1 transition-all active:scale-95`}
                  >
                    <Eye className="w-3 h-3" />
                    {report.accident_status === "RESOLVED" ? "View Resolved Details" : "Details"}
                  </button>
                </div>
              )}

              {isResponder && (
                <div className="flex gap-1.5 pt-0.5">
                  {report.accident_status !== "RESOLVED" && (
                    <button
                      onClick={async (e) => {
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
                      }}
                      disabled={isNavigating || isFetchingLocation}
                      className="flex-1 h-7.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-tighter rounded-md flex items-center justify-center gap-1 transition-all shadow-sm shadow-blue-100 active:scale-95 disabled:opacity-50"
                    >
                      {isNavigating || isFetchingLocation ? (
                        <Navigation className="w-3 h-3 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3" />
                      )}
                      Navigate
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReport(report);
                      setIsDetailsOpen(true);
                    }}
                    className={`${report.accident_status === "RESOLVED" ? "w-full" : "flex-1"} h-7.5 bg-slate-100 hover:bg-slate-200 text-gray-700 text-[10px] font-bold uppercase tracking-tighter rounded-md flex items-center justify-center gap-1 transition-all active:scale-95`}
                  >
                    <Eye className="w-3 h-3" />
                    {report.accident_status === "RESOLVED" ? "View Resolved Details" : "Details"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Drawer>
          <DrawerTrigger asChild>
            <div className="fixed bottom-4 left-4 right-4 z-40 bg-slate-100/95 backdrop-blur-sm shadow-lg rounded-full border border-red-400 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
              <BottomTrigger reports={reports} isMobile={isMobile} isExpanded={isExpanded} hasCritical={hasCritical} />
            </div>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh] rounded-t-[2.5rem] bg-white border-none outline-none shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden [&>div:first-child]:hidden">
            <div className="mx-auto mt-3 h-1.5 w-24 shrink-0 rounded-full bg-gray-300 " />
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
              <div>
                <DrawerHeader className="p-0 text-left">
                  <DrawerTitle className="text-xl font-black text-gray-900 tracking-tight">
                    Active Emergencies
                  </DrawerTitle>
                </DrawerHeader>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-full w-fit mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                  {reports.length} incidents tracked
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {reportsListContent}
          </DrawerContent>
        </Drawer>

        {selectedReport && (
          <>
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
              isLoading={availableRespondersLoading}
            />
          </>
        )}
      </>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[50]">
      {isExpanded && (
        <div className="mb-2 w-[420px] bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden animate-in zoom-in-95 fade-in duration-200 origin-bottom">
          <div className="px-4 py-3 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tighter">Emergency Feed</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{reports.length} Reports</span>
          </div>
          {reportsListContent}
        </div>
      )}

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center w-[420px] bg-slate-100/95 backdrop-blur-sm shadow-xl rounded-xl border border-red-400 cursor-pointer hover:bg-slate-200 transition-all active:scale-[0.99] group overflow-hidden"
      >
        <div className="flex-1">
          <BottomTrigger reports={reports} isMobile={isMobile} isExpanded={isExpanded} hasCritical={hasCritical} />
        </div>
      </div>

      {selectedReport && (
        <>
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
            isLoading={availableRespondersLoading}
          />
        </>
      )}
    </div>
  );
}
