"use client";
import { useState } from 'react';
import {
  MapPin,
  ChevronUp,
  ChevronDown,
  MessageCircleWarning,
  ChevronRight,
  Info
} from 'lucide-react';
import { Report } from "../../interfaces/get-all-reports-bystander.interface";
import { getSeverityColor } from "../../utils/severityColor";
import { DateTime } from 'luxon';
import { AccidentReportDetailsDialog } from "../dialogs/accident-report-details-dialog";
import { ResponderConfirmationDialog } from "../dialogs/responder-confirmation-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface BottomReportsProps {
  reports?: Report[];
  onGetDirections: (lat: number, lng: number) => void;
}

export default function BottomReports({ reports = [], onGetDirections }: BottomReportsProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [pendingCoordinates, setPendingCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetDirectionsClick = (lat: number, lng: number) => {
    setPendingCoordinates({ lat, lng });
    setIsConfirmationOpen(true);
  };

  const handleConfirmResponse = async () => {
    if (pendingCoordinates && selectedReport) {
      try {
        onGetDirections(pendingCoordinates.lat, pendingCoordinates.lng);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsConfirmationOpen(open);
    if (!open) {
      setPendingCoordinates(null);
    }
  };

  if (!reports || reports.length === 0) {
    return null;
  }

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
            onClick={() => {
              setSelectedReport(report);
              setIsDetailsOpen(true);
            }}
            className="group px-4 py-3.5 hover:bg-blue-50/30 cursor-pointer transition-all active:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${getSeverityColor(report.severity)} text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tight`}>
                    {report.severity}
                  </span>
                  <span className="text-[9px] font-poppins text-gray-400">#{report.report_number.slice(-4)}</span>
                  <span className="text-[9px] text-gray-400 ml-auto">
                    {DateTime.fromISO(report.created_at).toRelative()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1 flex-1">
                    {report.location_address}
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
              </div>
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
            <div className="fixed bottom-4 left-4 right-4 z-40 bg-white/95 backdrop-blur-sm shadow-lg rounded-full border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-bottom duration-700">
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
                  {sortedReports.some(r => r.severity.toLowerCase() === "critical") && (
                    <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                      Critical
                    </span>
                  )}
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </div>
              </div>
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
          <AccidentReportDetailsDialog
            isOpen={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            report={selectedReport}
            onGetDirections={handleGetDirectionsClick}
          />
        )}
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
      </>
    );
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[50]">
      {isExpanded && (
        <div className="mb-2 w-[420px] bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden">
          {reportsListContent}
        </div>
      )}

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-[420px] px-4 py-2.5 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl border border-blue-100 cursor-pointer hover:bg-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircleWarning className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-gray-900">Incident Reports</span>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {reports.length}
          </span>
          {sortedReports.some(r => r.severity.toLowerCase() === "critical") && (
            <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Critical
            </span>
          )}
        </div>

        <div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {selectedReport && (
        <AccidentReportDetailsDialog
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          report={selectedReport}
          onGetDirections={handleGetDirectionsClick}
        />
      )}
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
    </div>
  );
}
