import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { Report } from "../interface/get-all-reports-bystander.interface";
import { getSeverityColor } from "../utils/severityColor";
import { useState } from "react";
import { ReportDetailsDialog } from "./report-details-dialog";
import { useDirections } from "../hooks/use-directions";

interface ReportsListSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportsListSheet({ isOpen, onOpenChange }: ReportsListSheetProps) {
  const { data: allReports, isLoading } = useGetAllReportsBystanderQuery();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { openDirections } = useDirections();

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDialogOpen(true);
  };

  const handleGetDirections = (lat: number, lng: number) => {
    openDirections(lat, lng);
  };

  const reports = allReports?.reports || [];
  const criticalCount = reports.filter(r => r.severity?.toLowerCase() === 'critical').length;
  const highCount = reports.filter(r => r.severity?.toLowerCase() === 'high').length;
  const moderateCount = reports.filter(r => r.severity?.toLowerCase() === 'moderate').length;
  const minorCount = reports.filter(r => r.severity?.toLowerCase() === 'minor').length;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>All Reports</SheetTitle>
            <SheetDescription>
              View and manage all accident reports. Click on any report to see details.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 overflow-y-auto flex-1 px-4">
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">
                Total Reports: {reports.length}
              </h3>

              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading reports...
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports available
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => {
                    const severity = report.severity?.toLowerCase() || 'minor';
                    const imageUrl = Array.isArray(report.imageUrl) ? report.imageUrl[0] : report.imageUrl;

                    return (
                      <button
                        key={report.id}
                        onClick={() => handleReportClick(report)}
                        className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt="Report"
                              className="w-16 h-16 object-cover rounded-lg shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`${getSeverityColor(severity)} text-white px-2 py-0.5 rounded text-xs font-semibold`}>
                                {severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(report.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              ID: {report.report_number}
                            </p>
                            <p className="text-xs text-gray-600 truncate mt-1">
                              {report.location_address}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              By: {report.reporter_name}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ReportDetailsDialog
        report={selectedReport}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGetDirections={handleGetDirections}
      />
    </>
  );
}
