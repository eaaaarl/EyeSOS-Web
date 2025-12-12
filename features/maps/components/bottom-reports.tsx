"use client";
import { useState } from 'react';
import { FileText, MapPin, ChevronUp, ChevronDown, MessageCircleWarning } from 'lucide-react';
import { Report } from '../interface/get-all-reports-bystander.interface';
import { getSeverityColor } from '../utils/severityColor';
import { DateTime } from 'luxon';
import { AccidentReportDetailsDialog } from './accident-report-details-dialog';

interface BottomReportsProps {
  reports?: Report[];
  onGetDirections: (lat: number, lng: number) => void;
}

export default function BottomReports({ reports = [], onGetDirections }: BottomReportsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
      <div
        className="bg-linear-to-r from-blue-600 to-blue-700 px-4 py-2.5 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <MessageCircleWarning className='text-white w-4 h-4' />
          <h3 className="text-sm font-semibold text-white">
            All Incident Reports ({reports.length})
          </h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-white" />
        ) : (
          <ChevronUp className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Reports List */}
      {isExpanded && (
        <div className="max-h-[400px] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {sortedReports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setIsDetailsOpen(true);
                }}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-2">
                  {/* Severity Badge */}
                  <span className={`${getSeverityColor(report.severity)} text-white px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0`}>
                    {report.severity.toUpperCase()}
                  </span>

                  {/* Report Info */}
                  <div className="flex-1 min-w-0">
                    {/* Location - Most Important */}
                    <div className="flex items-start gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                        {report.location_address}
                      </p>
                    </div>

                    {/* Time and ID Row */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-medium text-gray-700 shrink-0">
                        {DateTime.fromISO(report.created_at).toFormat("MMM dd, h:mm a")}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate">
                        ID: #{report.report_number}
                      </p>
                    </div>

                    {/* Reporter Notes Preview - if available */}
                    {report.reporter_notes && (
                      <p className="text-[10px] text-gray-600 line-clamp-1 mt-1">
                        {report.reporter_notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accident Report Details Dialog */}
      {selectedReport && (
        <AccidentReportDetailsDialog
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          report={selectedReport}
          onGetDirections={onGetDirections}
        />
      )}
    </div>
  );
}