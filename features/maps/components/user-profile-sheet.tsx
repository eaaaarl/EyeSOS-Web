import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetAllReportsBystanderQuery } from "../api/mapApi";
import { Report } from "../interface/get-all-reports-bystander.interface";
import { getSeverityColor } from "../utils/severityColor";
import { useState } from "react";
import { ReportDetailsDialog } from "./report-details-dialog";
import { useDirections } from "../hooks/use-directions";

interface UserProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileSheet({ isOpen, onOpenChange }: UserProfileSheetProps) {
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

          <div className="space-y-4 overflow-y-auto flex-1 px-4 mt-4">
            {/* Statistics Summary */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
                <p className="text-xs text-red-600 mt-1 font-medium">Critical</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
                <p className="text-2xl font-bold text-orange-700">{highCount}</p>
                <p className="text-xs text-orange-600 mt-1 font-medium">High</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                <p className="text-2xl font-bold text-yellow-700">{moderateCount}</p>
                <p className="text-xs text-yellow-600 mt-1 font-medium">Moderate</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                <p className="text-2xl font-bold text-green-700">{minorCount}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">Minor</p>
              </div>
            </div>

            {/* Reports List */}
            <div className="space-y-2">
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
                              Report #{report.report_number}
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